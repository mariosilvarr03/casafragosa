// lib/syncJobs.ts
export type Job = {
  quarto: string;
  source: 'booking' | 'airbnb';
  url: string;
  camasDefault: number;
};

function env(name: string) {
  const v = process.env[name];
  if (!v) return null;
  const t = v.trim();
  if (!t) return null;
  if (t.toUpperCase().includes('COLOCA_AQUI_O_URL')) return null;
  return t;
}

export function buildJobs(): Job[] {
  const jobs: Job[] = [];

  const add = (quarto: string, source: 'booking' | 'airbnb', envName: string) => {
    const url = env(envName);
    if (!url) return;
    jobs.push({ quarto, source, url, camasDefault: 1 });
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
