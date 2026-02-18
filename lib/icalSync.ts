import ical from 'ical';
import db from '@/lib/db';

type SyncArgs = {
  quarto: string;         // "dormitorio" | "suite" | ...
  source: string;         // "booking" | "airbnb"
  url: string;
  camasDefault: number;   // dormitorio=1, quartos inteiros=1
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toCheckinISO(dateOnly: Date) {
  const d = new Date(dateOnly);
  d.setHours(14, 0, 0, 0); // check-in 14:00
  return d.toISOString();
}

function toCheckoutISO(dateOnly: Date) {
  const d = new Date(dateOnly);
  d.setHours(11, 0, 0, 0); // check-out 11:00
  return d.toISOString();
}

export async function syncIcalToDb({ quarto, source, url, camasDefault }: SyncArgs) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Falhou fetch iCal (${source}/${quarto}): ${res.status}`);
  }

  const text = await res.text();
  const parsed = ical.parseICS(text);

  const events: Array<{
    checkinISO: string;
    checkoutISO: string;
    nome: string;
    camas: number;
  }> = [];

  for (const key of Object.keys(parsed)) {
    const ev: any = parsed[key];
    if (!ev || ev.type !== 'VEVENT') continue;

    // alguns feeds podem marcar cancelados
    const status = (ev.status || '').toUpperCase();
    if (status === 'CANCELLED') continue;

    const start = ev.start ? new Date(ev.start) : null;
    const end = ev.end ? new Date(ev.end) : null;
    if (!start || !end) continue;

    // Normaliza por dia (muito importante!)
    const ciDay = startOfDay(start);
    const coDay = startOfDay(end);

    // Se por algum motivo vier invertido, ignora
    if (coDay <= ciDay) continue;

    const summary = String(ev.summary || `${source} reservation`);

    events.push({
      checkinISO: toCheckinISO(ciDay),
      checkoutISO: toCheckoutISO(coDay),
      nome: summary,
      camas: camasDefault,
    });
  }

  // Idempotente: apaga todas as reservas desse source+quarto e re-inserir
  const tx = db.transaction(() => {
    db.prepare(`DELETE FROM Reserva WHERE quarto = ? AND source = ?`).run(quarto, source);

    const insert = db.prepare(`
      INSERT INTO Reserva (quarto, checkin, checkout, camas, nomeHospede, phone, email, source, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const e of events) {
      insert.run(
        quarto,
        e.checkinISO,
        e.checkoutISO,
        e.camas,
        e.nome,
        null,
        null,
        source,
        'confirmada'
      );
    }
  });

  tx();

  return { inserted: events.length };
}
