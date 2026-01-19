

'use client';

import { useEffect, useState } from 'react';

type Reserva = {
  id: number;
  quarto: string;
  checkin: string;
  checkout: string;
  nomeHospede: string;
  source: string;
  status: string;
};

export default function RoomCalendar({ quarto }: { quarto: string }) {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    async function fetchReservas() {
      const res = await fetch('/api/reservas');
      const data: Reserva[] = await res.json();
      setReservas(data.filter((r) => r.quarto === quarto));
    }
    fetchReservas();
  }, [quarto]);

  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-7 gap-2 max-w-md">
      {days.map((day) => {
        const booked = reservas.some((r) => {
          const checkin = new Date(r.checkin);
          const checkout = new Date(r.checkout);
          return day >= checkin && day < checkout;
        });

        return (
          <div
            key={day.toISOString()}
            className={`p-3 text-center rounded-lg text-sm font-medium ${
              booked
                ? 'bg-gray-300 text-gray-500 line-through'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {day.getDate()}
          </div>
        );
      })}
    </div>
  );
}
