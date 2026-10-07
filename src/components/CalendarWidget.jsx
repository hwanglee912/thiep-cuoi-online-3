import React from 'react';
import { Heart } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';

export default function CalendarWidget({ date }) {
  const { data } = useWeddingData();
  const year = Number(date.year);
  const month = Number(date.month);
  const targetDay = Number(date.day);
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return (
    <div className="wedding-calendar max-w-md mx-auto my-8 text-center" data-reveal="up" aria-label={`Lịch tháng ${month} năm ${year}`}>
      <img className="calendar-backdrop" src={data.couple.calendarImage || data.couple.heroImage} style={{ objectPosition: data.couple.calendarImagePosition || '50% 38%' }} alt="" aria-hidden="true" loading="lazy" decoding="async" width="614" height="921" />
      <div className="calendar-scrim" aria-hidden="true" />
      <div className="calendar-content">
      <p className="calendar-month font-script">Tháng {month}</p>
      <p className="calendar-year font-serif">{year}</p>
      <div className="calendar-weekdays grid grid-cols-7 gap-1 font-serif">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => <div key={day}>{day}</div>)}
      </div>
      <div className="calendar-days grid grid-cols-7 gap-1 font-serif">
        {Array.from({ length: offset }, (_, index) => <div key={`empty-${index}`} aria-hidden="true" />)}
        {Array.from({ length: count }, (_, index) => index + 1).map((day) => (
          <div key={day} className="calendar-day flex items-center justify-center">
            {day === targetDay
              ? <span aria-label={`${day}/${month}/${year}, ngày cưới`} className="calendar-wedding-day"><Heart aria-hidden="true" className="calendar-heart" /><span>{day}</span></span>
              : <span>{day}</span>}
          </div>
        ))}
      </div>
      <p className="calendar-quote font-serif italic">Yêu người vừa ý, cưới người mình thương.</p>
      </div>
    </div>
  );
}
