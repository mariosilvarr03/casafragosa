'use client';

import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CAPACIDADE_QUARTO } from '@/lib/capacidade';

type Reserva = {
  id: number;
  quarto: string;
  checkin: string;
  checkout: string;
  camas: number;
  nomeHospede?: string;
  phone?: string | null;
  email?: string | null;
};

export default function RoomCalendar({ quarto }: { quarto: string }) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [checkin, setCheckin] = useState<Date | null>(null);
  const [checkout, setCheckout] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bedsSelected, setBedsSelected] = useState(1);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const capacidade = CAPACIDADE_QUARTO[quarto] ?? 1;

  /* ---------------- Datas do mês ---------------- */

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(startOfMonth);
    d.setDate(i + 1);
    return d;
  });

  /* ---------------- Helpers ---------------- */

  function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function sameDay(a: Date, b: Date) {
    return startOfDay(a).getTime() === startOfDay(b).getTime();
  }

  function inRange(day: Date, start: Date, end: Date) {
    // inclusive start, inclusive end for selection UI
    const d = startOfDay(day).getTime();
    const s = startOfDay(start).getTime();
    const e = startOfDay(end).getTime();
    return d >= s && d <= e;
  }

  function camasOcupadasNoDia(day: Date) {
    const day0 = startOfDay(day);

    return reservas
      .filter((r) => r.quarto === quarto) // ✅ FILTRO ESSENCIAL
      .reduce((sum, r) => {
        const ci0 = startOfDay(new Date(r.checkin));
        const co0 = startOfDay(new Date(r.checkout));
        const ocupa = day0 >= ci0 && day0 < co0;
        if (!ocupa) return sum;

        const camas = Number(r.camas ?? 0);
        return sum + (Number.isFinite(camas) ? camas : 0);
      }, 0);
  }

  function estadoDoDia(day: Date) {
    const ocupadas = camasOcupadasNoDia(day);

    if (ocupadas === 0) return 'free';
    if (ocupadas < capacidade) return 'partial';
    return 'full';
  }

  /* ---------------- Seleção ---------------- */

  function isInSelectedRange(day: Date) {
    if (!checkin) return false;
    if (checkin && !checkout) return sameDay(day, checkin);
    return checkout ? inRange(day, checkin, checkout) : false;
  }

  function isRangeEdge(day: Date) {
    if (!checkin) return false;
    if (checkin && !checkout) return sameDay(day, checkin);
    if (!checkout) return false;
    return sameDay(day, checkin) || sameDay(day, checkout);
  }

  function handleClick(day: Date) {
    const estado = estadoDoDia(day);
    const requestedBeds = 1; // selection assumes 1 bed

    // escolher check-in
    if (!checkin) {
      if (camasOcupadasNoDia(day) + requestedBeds > capacidade) return;

      const d = new Date(day);
      d.setHours(14, 0, 0, 0);
      setCheckin(d);
      return;
    }

    // escolher check-out
    if (checkin && !checkout) {
      // allow clicking earlier day to restart selection
      if (startOfDay(day) <= startOfDay(checkin)) {
        if (camasOcupadasNoDia(day) + requestedBeds > capacidade) return;
        const d = new Date(day);
        d.setHours(14, 0, 0, 0);
        setCheckin(d);
        return;
      }

      // checkout day itself must have capacity for requested beds
      if (camasOcupadasNoDia(day) + requestedBeds > capacidade) return;

      // verificar dias intermédios (checkin..day) precisam ter capacidade
      for (let d = startOfDay(checkin); d < startOfDay(day); ) {
        if (camasOcupadasNoDia(d) + requestedBeds > capacidade) return;
        d.setDate(d.getDate() + 1);
      }

      const out = new Date(day);
      out.setHours(11, 0, 0, 0);
      setCheckout(out);
      return;
    }

    // reset
    setCheckin(null);
    setCheckout(null);
  }

  /* ---------------- Reservations / modal ---------------- */

  const fetchReservas = () =>
    fetch('/api/reservas')
      .then((res) => res.json())
      .then(setReservas)
      .catch(() => setReservas([]));

  useEffect(() => {
    fetchReservas();
  }, []);

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

  function maxAvailableBedsForRange(start: Date, end: Date) {
    const days = daysBetween(start, end);
    if (days.length === 0) return capacidade;
    return Math.min(
      ...days.map((d) => Math.max(0, capacidade - camasOcupadasNoDia(d)))
    );
  }

  async function submitReservation() {
    setBookingError(null);
    setBookingSuccess(null);

    if (!checkin || !checkout) {
      setBookingError('Seleciona check-in e check-out.');
      return;
    }

    const trimmedName = (nome || '').trim();
    const trimmedPhone = (phone || '').trim();
    const trimmedEmail = (email || '').trim();

    // Unicode-safe name: letters, spaces, hyphen, apostrophe (min 2 chars)
    const nameRegex = /^[\p{L}'\-\s]{2,}$/u;
    if (!trimmedName || !nameRegex.test(trimmedName)) {
      setBookingError('Nome inválido — apenas letras, espaços, "-" e apóstrofo (mín. 2 caracteres).');
      return;
    }

    // email basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setBookingError('Email inválido.');
      return;
    }

    // phone: use digits only and check length (react-phone-input-2 returns digits like "351912345678")
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      setBookingError('Telefone inválido (tamanho entre 8 e 15 dígitos incluindo código).');
      return;
    }

    // check capacity server-side will also validate, but do a pre-check
    const max = maxAvailableBedsForRange(checkin, checkout);
    if (bedsSelected > max) {
      setBookingError('Número de camas solicitado maior que disponibilidade no período.');
      return;
    }

    const body = {
      quarto,
      checkin: checkin.toISOString(),
      checkout: checkout.toISOString(),
      camas: bedsSelected,
      nomeHospede: trimmedName,
      phone: `+${digitsOnly}`,
      email: trimmedEmail,
      source: 'manual',
      status: 'confirmada',
    };

    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 201) {
        const data = await res.json();
        setBookingSuccess(`Reserva criada (id ${data.id}).`);
        // refresh
        fetchReservas();
        setTimeout(() => {
          setModalOpen(false);
          setNome('');
          setPhone('');
          setEmail('');
          setBedsSelected(1);
          setCheckin(null);
          setCheckout(null);
          setBookingSuccess(null);
        }, 1200);
        return;
      }

      const err = await res.json().catch(() => null);
      setBookingError(err?.error || 'Erro ao criar reserva.');
    } catch (e: any) {
      setBookingError(e?.message || String(e));
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div id="calendar">
      <div className="flex justify-between mb-3 items-center">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
        >
          ←
        </button>

        <strong className="capitalize">
          {currentMonth.toLocaleDateString('pt-PT', {
            month: 'long',
            year: 'numeric',
          })}
        </strong>

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const estado = estadoDoDia(day);
          const ocupadas = camasOcupadasNoDia(day);

          const selected = isInSelectedRange(day);
          const edge = isRangeEdge(day);

          const baseColor =
            estado === 'free'
              ? 'bg-emerald-100 cursor-pointer'
              : estado === 'partial'
              ? 'bg-yellow-200 cursor-pointer'
              : 'bg-red-300 cursor-not-allowed';

          // Selection overlay:
          // - edges: darker green
          // - middle: slightly darker green
          // (we override background color only when selected)
          const selectionColor = edge ? 'bg-emerald-600' : 'bg-emerald-400';
          const selectionText = 'text-white';

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleClick(day)}
              className={`p-3 rounded text-center text-sm select-none
                ${selected ? `${selectionColor} ${selectionText} cursor-pointer` : baseColor}
              `}
            >
              {day.getDate()}
              <div className={`text-xs ${selected ? 'text-white/90' : ''}`}>
                {ocupadas}/{capacidade}
              </div>
            </div>
          );
        })}
      </div>

      {checkin && checkout && (
        <p className="mt-3 text-sm">
          Check-in: {checkin.toLocaleString('pt-PT')} | Check-out:{' '}
          {checkout.toLocaleString('pt-PT')}
        </p>
      )}

      <div className="mt-4">
        <button
          disabled={!(checkin && checkout)}
          onClick={() => {
            if (!checkin || !checkout) return;
            // compute max beds and set default
            const max = maxAvailableBedsForRange(checkin, checkout);
            setBedsSelected(Math.min(1, Math.max(1, Math.min(max, capacidade))));
            setModalOpen(true);
          }}
          className={`px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 ${
            !(checkin && checkout) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Reservar
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Fazer reserva — {quarto}</h3>

            <div className="space-y-2">
              <label className="block text-sm">Nome *</label>
              <input
                className="w-full border px-2 py-1 rounded"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <label className="block text-sm">Telefone *</label>
              <div>
                <PhoneInput
                  country={'pt'}
                  value={phone}
                  onChange={(val: any) => setPhone(val)}
                  enableSearch
                  countryCodeEditable={false}
                  containerStyle={{ width: '100%' }}
                  buttonStyle={{ width: 40 }}
                  inputStyle={{ paddingLeft: 44 }}
                  inputProps={{ name: 'phone', required: true, className: 'w-full border px-2 py-1 rounded' }}
                />
              </div>

              <label className="block text-sm">Email *</label>
              <input
                className="w-full border px-2 py-1 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {quarto === 'dormitorio' && checkin && checkout && (
                <div>
                  <label className="block text-sm">Camas</label>
                  <select
                    value={bedsSelected}
                    onChange={(e) => setBedsSelected(Number(e.target.value))}
                    className="w-full border px-2 py-1 rounded"
                  >
                    {Array.from({ length: Math.max(1, maxAvailableBedsForRange(checkin, checkout)) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              {bookingError && <div className="text-red-600 text-sm">{bookingError}</div>}
              {bookingSuccess && <div className="text-green-600 text-sm">{bookingSuccess}</div>}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 rounded border" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="px-4 py-1 rounded bg-emerald-600 text-white" onClick={submitReservation}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}