// app/admin/actions.ts
'use server';

import db from '@/lib/db';
import { syncIcalToDb } from '@/lib/icalSync';
import { buildJobs } from '@/lib/syncJobs';

export async function runSyncAction(_formData: FormData): Promise<void> {
  const jobs = buildJobs();

  if (jobs.length === 0) {
    const summary = 'Nenhum iCal configurado no .env.local';
    db.prepare(`INSERT INTO SyncLog (ranAt, ok, summary) VALUES (?, ?, ?)`)
      .run(new Date().toISOString(), 0, summary);
    return;
  }

  const results: any[] = [];
  const errors: any[] = [];

  for (const j of jobs) {
    try {
      const r = await syncIcalToDb(j);
      results.push({ ...j, ...r });
    } catch (e: any) {
      errors.push({ ...j, error: e?.message ?? String(e) });
    }
  }

  const ok = errors.length === 0;
  const summaryObj = { ran: jobs.length, results, errors };

  db.prepare(`INSERT INTO SyncLog (ranAt, ok, summary) VALUES (?, ?, ?)`)
    .run(new Date().toISOString(), ok ? 1 : 0, JSON.stringify(summaryObj));
}
