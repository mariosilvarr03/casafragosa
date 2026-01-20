import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { CAPACIDADE_QUARTO } from '@/lib/capacidade';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// devolve lista de dias (00:00) no intervalo [start, end)
function daysBetween(start: Date, end: Date) {
  const out: Date[] = [];
  const cur = startOfDay(start);
  const end0 = startOfDay(end);

  while (cur < end0) {
    out.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export async function GET() {
  const reservas = db.prepare('SELECT * FROM Reserva').all();
  return NextResponse.json(reservas);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const quarto: string = data.quarto;
  const capacidade = CAPACIDADE_QUARTO[quarto] ?? 1;

  const camasPedidas = Number(data.camas ?? 1);
  if (!Number.isFinite(camasPedidas) || camasPedidas <= 0) {
    return NextResponse.json(
      { error: 'Número de camas inválido.' },
      { status: 400 }
    );
  }

  // Parse datas
  const checkin = new Date(data.checkin);
  const checkout = new Date(data.checkout);

  if (Number.isNaN(checkin.getTime()) || Number.isNaN(checkout.getTime())) {
    return NextResponse.json(
      { error: 'Datas inválidas.' },
      { status: 400 }
    );
  }

  if (checkout <= checkin) {
    return NextResponse.json(
      { error: 'Checkout tem de ser depois do checkin.' },
      { status: 400 }
    );
  }

  // vamos validar por dia: [checkinDay, checkoutDay)
  const ci0 = startOfDay(checkin);
  const co0 = startOfDay(checkout);

  // buscar reservas desse quarto que possam sobrepor o intervalo
  const existing = db
    .prepare(
      `
      SELECT checkin, checkout, camas
      FROM Reserva
      WHERE quarto = ?
        AND NOT (date(checkout) <= date(?) OR date(checkin) >= date(?))
    `
    )
    .all(quarto, ci0.toISOString(), co0.toISOString()) as Array<{
    checkin: string;
    checkout: string;
    camas: number;
  }>;

  // validar cada dia do intervalo
  const days = daysBetween(ci0, co0);

  for (const day of days) {
    const ocupadas = existing.reduce((sum, r) => {
      const rCi0 = startOfDay(new Date(r.checkin));
      const rCo0 = startOfDay(new Date(r.checkout));
      const ocupa = day >= rCi0 && day < rCo0;
      if (!ocupa) return sum;

      const c = Number(r.camas ?? 0);
      return sum + (Number.isFinite(c) ? c : 0);
    }, 0);

    if (ocupadas + camasPedidas > capacidade) {
      return NextResponse.json(
        {
          error: 'Sem disponibilidade para esse intervalo.',
          details: {
            dia: day.toISOString().slice(0, 10),
            ocupadas,
            camasPedidas,
            capacidade,
          },
        },
        { status: 409 }
      );
    }
  }

  // inserir
  const stmt = db.prepare(`
    INSERT INTO Reserva (quarto, checkin, checkout, camas, nomeHospede, source, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    quarto,
    checkin.toISOString(),
    checkout.toISOString(),
    camasPedidas,
    data.nomeHospede || 'Sem nome',
    data.source || 'manual',
    data.status || 'confirmada'
  );

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
