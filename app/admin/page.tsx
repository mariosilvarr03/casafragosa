// app/admin/page.tsx
import db from '@/lib/db';
import Link from 'next/link';
import { runSyncAction } from './actions';

type Search = {
  quarto?: string;
  source?: string;
  day?: string; // "2026-01-20"
};


function getLastSync() {
  return db.prepare(`SELECT * FROM SyncLog ORDER BY id DESC LIMIT 1`).get() as
    | { ranAt: string; ok: number; summary: string }
    | undefined;
}

function getReservas({ quarto, source, day }: Search) {
  const where: string[] = [];
  const params: any[] = [];

  if (quarto) {
    where.push(`quarto = ?`);
    params.push(quarto);
  }
  if (source) {
    where.push(`source = ?`);
    params.push(source);
  }

  // ✅ Filtro robusto por dia (overlap por datetime)
  if (day) {
    const start = new Date(`${day}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    // ocupado se: checkout > start AND checkin < end
    where.push(`checkout > ? AND checkin < ?`);
    params.push(start.toISOString(), end.toISOString());
  }

  const sql = `
    SELECT id, quarto, checkin, checkout, camas, nomeHospede, source, status
    FROM Reserva
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY checkin ASC
    LIMIT 300
  `;

  return db.prepare(sql).all(...params) as Array<{
    id: number;
    quarto: string;
    checkin: string;
    checkout: string;
    camas: number;
    nomeHospede: string;
    source: string;
    status: string;
  }>;
}



export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  // ✅ unwrap do searchParams
  const sp = (await searchParams) ?? {};
  const quarto = sp.quarto ?? '';
  const source = sp.source ?? '';
  const day = sp.day ?? '';

  const reservas = getReservas({
    quarto: quarto || undefined,
    source: source || undefined,
    day: day || undefined,
  });


  const last = getLastSync();

  let lastSummary: any = null;
  try {
    lastSummary = last?.summary ? JSON.parse(last.summary) : null;
  } catch {
    lastSummary = last?.summary ?? null;
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-gray-600">Gestão de reservas + sincronização iCal</p>
      </header>

      {/* SYNC */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold">Sincronização iCal</h2>
            <p className="text-sm text-gray-600">
              Importa Booking/Airbnb para a base de dados.
            </p>
          </div>

          <form action={runSyncAction}>
            <button
              className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition"
              type="submit"
            >
              Sincronizar agora
            </button>
          </form>
        </div>

        <div className="text-sm text-gray-700">
          <p>
            <span className="font-medium">Último sync:</span>{' '}
            {last ? (
              <>
                {new Date(last.ranAt).toLocaleString('pt-PT')} ·{' '}
                {last.ok ? (
                  <span className="text-emerald-700 font-medium">OK</span>
                ) : (
                  <span className="text-red-700 font-medium">ERRO</span>
                )}
              </>
            ) : (
              '—'
            )}
          </p>

          {lastSummary && (
            <pre className="mt-3 bg-gray-50 border rounded-xl p-3 overflow-auto text-xs">
              {typeof lastSummary === 'string'
                ? lastSummary
                : JSON.stringify(lastSummary, null, 2)}
            </pre>
          )}
        </div>
      </section>

      {/* FILTROS */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-xl font-semibold">Reservas</h2>

          <Link
            href="/admin"
            className="text-sm text-emerald-700 hover:underline"
          >
            Limpar filtros
          </Link>
        </div>

        <form className="flex flex-wrap gap-3 items-end" method="GET">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Quarto</label>
            <select
              name="quarto"
              defaultValue={quarto}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="dormitorio">Dormitório</option>
              <option value="suite">Suite</option>
              <option value="estudio">Estúdio</option>
              <option value="t2">T2</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Origem</label>
            <select
              name="source"
              defaultValue={source}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Todas</option>
              <option value="booking">Booking</option>
              <option value="airbnb">Airbnb</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Dia</label>
            <input
              type="date"
              name="day"
              defaultValue={day}
              className="border rounded-lg px-3 py-2"
            />
          </div>


          <button
            className="bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition"
            type="submit"
          >
            Filtrar
          </button>
        </form>

        <div className="overflow-auto border rounded-xl">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Quarto</th>
                <th className="text-left p-3">Check-in</th>
                <th className="text-left p-3">Check-out</th>
                <th className="text-left p-3">Camas</th>
                <th className="text-left p-3">Nome</th>
                <th className="text-left p-3">Origem</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.quarto}</td>
                  <td className="p-3">
                    {new Date(r.checkin).toLocaleString('pt-PT')}
                  </td>
                  <td className="p-3">
                    {new Date(r.checkout).toLocaleString('pt-PT')}
                  </td>
                  <td className="p-3">{r.camas}</td>
                  <td className="p-3">{r.nomeHospede}</td>
                  <td className="p-3">{r.source}</td>
                  <td className="p-3">{r.status}</td>
                </tr>
              ))}

              {reservas.length === 0 && (
                <tr>
                  <td className="p-6 text-gray-500" colSpan={8}>
                    Sem reservas para estes filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500">
          A mostrar até 300 reservas (ordenadas por check-in).
        </p>
      </section>
    </div>
  );
}
