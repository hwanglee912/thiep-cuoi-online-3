import React from 'react';
import { Heart } from 'lucide-react';

export default function CalendarWidget({ date }) {
  const year = Number(date.year);
  const month = Number(date.month);
  const targetDay = Number(date.day);
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return (
    <div className="max-w-md mx-auto my-8 p-5 sm:p-7 rounded-2xl glass-card shadow-soft text-center" data-reveal="up" aria-label={`Lịch tháng ${month} năm ${year}`}>
      <p className="font-serif font-semibold text-lg text-charcoal-900 mb-5">Tháng {month} · {year}</p>
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-charcoal-800/80 pb-2 border-b border-champagne">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 pt-3 text-sm">
        {Array.from({ length: offset }, (_, index) => <div key={`empty-${index}`} aria-hidden="true" />)}
        {Array.from({ length: count }, (_, index) => index + 1).map((day) => (
          <div key={day} className="h-9 flex items-center justify-center">
            {day === targetDay
              ? <span aria-label={`${day}/${month}/${year}, ngày cưới`} className="relative w-8 h-8 rounded-full bg-gold-700 text-white font-semibold grid place-items-center">{day}<Heart aria-hidden="true" className="absolute -top-1 -right-1 w-3 h-3 text-rosewood fill-rosewood" /></span>
              : <span>{day}</span>}
          </div>
        ))}
      </div>
      <p className="mt-5 pt-4 border-t border-champagne font-serif italic text-sm text-charcoal-800/80">Yêu người vừa ý, cưới người mình thương.</p>
    </div>
  );
}
