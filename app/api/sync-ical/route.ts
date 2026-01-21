// app/api/sync-ical/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { syncIcalToDb } from '@/lib/icalSync';

type Job = {
  quarto: string;
  source: 'booking' | 'airbnb';
  url: string;
  camasDefault: number;
};

function env(name: string) {
  const v = process.env[name];
  // trata "" e "COLOCA_AQUI_O_URL" como "não definido"
  if (!v) return null;
  const trimmed = v.trim();
  if (!trimmed) return null;
  if (trimmed.toUpperCase().includes('COLOCA_AQUI_O_URL')) return null;
  return trimmed;
}

function buildJobs(): Job[] {
  const jobs: Job[] = [];

  const add = (quarto: string, source: 'booking' | 'airbnb', envName: string) => {
    const url = env(envName);
    if (!url) return;
    jobs.push({
      quarto,
      source,
      url,
      camasDefault: 1, // iCal = 1 reserva (para dormitório conta como 1 cama)
    });
  };

  add('dormitorio', 'booking', 'ICAL_BOOKING_DORMITORIO');
  add('dormitorio', 'airbnb',  'ICAL_AIRBNB_DORMITORIO');

  add('suite', 'booking', 'ICAL_BOOKING_SUITE');
  add('suite', 'airbnb',  'ICAL_AIRBNB_SUITE');

  add('estudio', 'booking', 'ICAL_BOOKING_ESTUDIO');
  add('estudio', 'airbnb',  'ICAL_AIRBNB_ESTUDIO');

  add('t2', 'booking', 'ICAL_BOOKING_T2');
  add('t2', 'airbnb',  'ICAL_AIRBNB_T2');

  return jobs;
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sync-secret');
  if (!process.env.SYNC_SECRET || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobsAll = buildJobs();

  if (jobsAll.length === 0) {
    return NextResponse.json(
      {
        error: 'Nenhum iCal configurado.',
        hint: 'Define pelo menos uma variável ICAL_* no .env.local (ex: ICAL_BOOKING_DORMITORIO="http://localhost:3000/test.ics")',
      },
      { status: 400 }
    );
  }

  // filtros opcionais: /api/sync-ical?quarto=dormitorio&source=booking
  const { searchParams } = new URL(req.url);
  const filtroQuarto = searchParams.get('quarto')?.toLowerCase() ?? null;
  const filtroSource = searchParams.get('source')?.toLowerCase() ?? null;

  const jobs = jobsAll.filter((j) => {
    if (filtroQuarto && j.quarto !== filtroQuarto) return false;
    if (filtroSource && j.source !== filtroSource) return false;
    return true;
  });

  if (jobs.length === 0) {
    return NextResponse.json(
      {
        error: 'Nenhum job corresponde ao filtro.',
        available: jobsAll.map((j) => ({ quarto: j.quarto, source: j.source })),
        received: { quarto: filtroQuarto, source: filtroSource },
      },
      { status: 400 }
    );
  }

  const results: any[] = [];
  const errors: any[] = [];

  for (const j of jobs) {
    try {
      const r = await syncIcalToDb(j);
      results.push({ ...j, ...r });
    } catch (e: any) {
      errors.push({
        quarto: j.quarto,
        source: j.source,
        url: j.url,
        error: e?.message ?? String(e),
      });
    }
  }

  return NextResponse.json({
    ok: errors.length === 0,
    ran: jobs.length,
    results,
    errors,
  });
}
