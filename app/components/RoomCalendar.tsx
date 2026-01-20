'use client';

import { useEffect, useState } from 'react';
import { CAPACIDADE_QUARTO } from '@/lib/capacidade';

type Reserva = {
  id: number;
  quarto: string;
  checkin: string;
  checkout: string;
  camas: number;
};

export default function RoomCalendar({ quarto }: { quarto: string }) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [checkin, setCheckin] = useState<Date | null>(null);
  const [checkout, setCheckout] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetch('/api/reservas')
      .then(res => res.json())
      .then(setReservas);
  }, []);

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

  /* ---------------- Lógica de ocupação ---------------- */

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function camasOcupadasNoDia(day: Date) {
  const day0 = startOfDay(day);

  return reservas.reduce((sum, r) => {
    const ci0 = startOfDay(new Date(r.checkin));
    const co0 = startOfDay(new Date(r.checkout)); // dia de checkout NÃO conta

    // ocupa se day está em [checkinDay, checkoutDay)
    const ocupa = day0 >= ci0 && day0 < co0;

    if (!ocupa) return sum;

    const camas = Number(r.camas || 0);
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

  function isSelected(day: Date) {
    if (!checkin) return false;

    if (checkin && !checkout) {
      return day.toDateString() === checkin.toDateString();
    }

    return (
      checkout &&
      day >= checkin &&
      day < checkout
    );
  }

  function handleClick(day: Date) {
    const estado = estadoDoDia(day);

    // escolher check-in
    if (!checkin) {
      if (estado === 'full') return;

      const d = new Date(day);
      d.setHours(14, 0, 0, 0);
      setCheckin(d);
      return;
    }

    // escolher check-out
    if (checkin && !checkout) {
      if (day <= checkin) return;
      if (estado === 'full') return;

      // verificar dias intermédios
      for (
        let d = new Date(checkin);
        d < day;
        d.setDate(d.getDate() + 1)
      ) {
        if (estadoDoDia(d) !== 'free') return;
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

  /* ---------------- UI ---------------- */

  return (
    <div>
      <div className="flex justify-between mb-3 items-center">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1
              )
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
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1
              )
            )
          }
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const estado = estadoDoDia(day);
          const ocupadas = camasOcupadasNoDia(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleClick(day)}
              className={`p-3 rounded text-center text-sm select-none
                ${
                  estado === 'free'
                    ? 'bg-emerald-100 cursor-pointer'
                    : estado === 'partial'
                    ? 'bg-yellow-200 cursor-pointer'
                    : 'bg-red-300 cursor-not-allowed'
                }
                ${isSelected(day) ? 'ring-2 ring-black' : ''}
              `}
            >
              {day.getDate()}
              <div className="text-xs">
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
    </div>
  );
}
