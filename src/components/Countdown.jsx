import React, { useEffect, useState } from 'react';
import { useWeddingData } from '../context/WeddingDataContext';
import { getCountdownTarget } from '../utils/weddingDate';

function remaining(target) {
  const seconds = Math.max(0, Math.floor((new Date(target).getTime() - Date.now()) / 1000)) || 0;
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}

export default function Countdown() {
  const { data } = useWeddingData();
  const target = getCountdownTarget(data);
  const [values, setValues] = useState(() => remaining(target));
  useEffect(() => {
    let timer;
    const update = () => setValues(remaining(target));
    const resume = () => {
      clearInterval(timer);
      if (!document.hidden) { update(); timer = setInterval(update, 1000); }
    };
    resume();
    document.addEventListener('visibilitychange', resume);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', resume); };
  }, [target]);
  return (
    <div className="countdown" aria-label="Thời gian còn lại đến ngày cưới">
      {['Ngày', 'Giờ', 'Phút', 'Giây'].map((label, index) => (
        <div key={label} className="countdown-unit">
          <span className="font-serif countdown-value">{String(values[index]).padStart(2, '0')}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
