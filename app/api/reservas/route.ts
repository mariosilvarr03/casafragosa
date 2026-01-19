import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const reservas = db.prepare('SELECT * FROM Reserva').all();
  return NextResponse.json(reservas);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const stmt = db.prepare(`
    INSERT INTO Reserva (quarto, checkin, checkout, nomeHospede, source, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.quarto,
    data.checkin,
    data.checkout,
    data.nomeHospede,
    data.source || 'manual',
    data.status || 'confirmada'
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}
