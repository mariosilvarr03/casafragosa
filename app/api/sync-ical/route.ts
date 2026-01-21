import { NextRequest, NextResponse } from 'next/server';
import { syncIcalToDb } from '@/lib/icalSync';

function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sync-secret');
  if (!process.env.SYNC_SECRET || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobs = [
    { quarto: 'dormitorio', source: 'booking', url: must('ICAL_BOOKING_DORMITORIO'), camasDefault: 1 },
    { quarto: 'dormitorio', source: 'airbnb',  url: must('ICAL_AIRBNB_DORMITORIO'),  camasDefault: 1 },
  ];


  const results = [];
  for (const j of jobs) {
    const r = await syncIcalToDb(j);
    results.push({ ...j, ...r });
  }

  return NextResponse.json({ ok: true, results });
}
