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

type DayType = 'free' | 'checkin' | 'checkout' | 'occupied' | 'selected';

interface RoomCalendarProps {
  quarto: string;
}

export default function RoomCalendar({ quarto }: RoomCalendarProps) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selection, setSelection] = useState<{ checkin: Date | null; checkout: Date | null }>({
    checkin: null,
    checkout: null,
  });

  // Buscar reservas da API
  useEffect(() => {
    async function fetchReservas() {
      const res = await fetch('/api/reservas');
      const data: Reserva[] = await res.json();
      setReservas(data.filter((r) => r.quarto === quarto));
    }
    fetchReservas();
  }, [quarto]);

  // Navegação meses
  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  // Dias do mês
  const daysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  // Tooltip e estilos
  const titleMap: Record<DayType, string> = {
    free: 'Disponível',
    checkin: 'Check-in (14:00)',
    checkout: 'Check-out (11:00)',
    occupied: 'Ocupado',
    selected: 'Selecionado',
  };

  const styles: Record<DayType, string> = {
    free: 'bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200',
    checkin: 'bg-emerald-400 text-white font-bold cursor-pointer',
    checkout: 'bg-yellow-300 text-yellow-900 font-bold cursor-pointer',
    occupied: 'bg-gray-300 text-gray-500 line-through cursor-not-allowed',
    selected: 'bg-emerald-500 text-white font-semibold',
  };

  const monthName = currentMonth.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });

  // Tipo do dia
  const getDayType = (day: Date): DayType => {
    for (const r of reservas) {
      const checkin = new Date(r.checkin);
      const checkout = new Date(r.checkout);

      if (day.toDateString() === checkin.toDateString()) return 'checkin';
      if (day.toDateString() === checkout.toDateString()) return 'checkout';
      if (day > checkin && day < checkout) return 'occupied';
    }

    if (selection.checkin && selection.checkout) {
      if (day >= selection.checkin && day <= selection.checkout) return 'selected';
    }

    if (selection.checkin && !selection.checkout) {
      if (day.toDateString() === selection.checkin.toDateString()) return 'selected';
    }

    return 'free';
  };

  // Seleção check-in / check-out
  const handleDayClick = (day: Date) => {
    const type = getDayType(day);

    if (type === 'occupied') return;

    // Primeiro clique = check-in
    if (!selection.checkin) {
      if (type === 'free' || type === 'checkout') {
        setSelection({ checkin: day, checkout: null });
      }
      return;
    }

    // Segundo clique = check-out
    if (!selection.checkout) {
      if (type !== 'free' && type !== 'checkin') return;

      // Não permitir check-in e check-out no mesmo dia
      if (day.toDateString() === selection.checkin.toDateString()) {
        alert('O check-out deve ser pelo menos 1 dia depois do check-in.');
        return;
      }

      const start = selection.checkin;
      const end = day > start ? day : start;
      const intervalValid = days
        .filter((d) => d > start && d < end) // apenas os dias entre checkin e checkout
        .every((d) => getDayType(d) === 'free');

      if (!intervalValid) {
        alert('O intervalo contém dias ocupados, escolha outro.');
        return;
      }

      setSelection({ ...selection, checkout: day });
      return;
    }

    // Reiniciar seleção
    setSelection({ checkin: day, checkout: null });
  };

  return (
    <div className="space-y-4">
      {/* Navegação do mês */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={prevMonth}
          className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          ←
        </button>
        <span className="font-semibold text-lg">{monthName}</span>
        <button
          onClick={nextMonth}
          className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          →
        </button>
      </div>

      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-700">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const type = getDayType(day);
          const clickable = type === 'free' || type === 'checkin' || type === 'checkout';
          return (
            <div
              key={day.toISOString()}
              className={`p-3 text-center rounded-lg text-sm font-medium ${styles[type]} ${
                clickable ? 'transition hover:scale-105' : ''
              }`}
              title={titleMap[type]}
              onClick={() => clickable && handleDayClick(day)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

      {/* Informações da seleção */}
      {selection.checkin && selection.checkout && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Check-in:</strong> {selection.checkin.toLocaleDateString()} |{' '}
          <strong>Check-out:</strong> {selection.checkout.toLocaleDateString()}
        </div>
      )}
      {selection.checkin && !selection.checkout && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Check-in:</strong> {selection.checkin.toLocaleDateString()} (aguardando check-out)
        </div>
      )}
    </div>
  );
}
