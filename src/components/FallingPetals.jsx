import React, { useEffect, useRef } from 'react';

export default function FallingPetals() {
  const layerRef = useRef(null);
  useEffect(() => {
    const pause = () => layerRef.current?.classList.toggle('petals-paused', document.hidden);
    pause();
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  // Delicate micro-petals, soft and small
  const petals = [
    { id: 1, left: '6%', delay: '0s', duration: '13s', size: 'w-1.5 h-1.5', opacity: '0.35' },
    { id: 2, left: '18%', delay: '3s', duration: '15s', size: 'w-2 h-2', opacity: '0.3' },
    { id: 3, left: '28%', delay: '6s', duration: '14s', size: 'w-1.5 h-1.5', opacity: '0.25' },
    { id: 4, left: '42%', delay: '1s', duration: '16s', size: 'w-2 h-2', opacity: '0.35' },
    { id: 5, left: '55%', delay: '8s', duration: '15s', size: 'w-1.5 h-1.5', opacity: '0.2' },
    { id: 6, left: '68%', delay: '4s', duration: '17s', size: 'w-2.5 h-2.5', opacity: '0.3' },
    { id: 7, left: '78%', delay: '2s', duration: '13s', size: 'w-1.5 h-1.5', opacity: '0.35' },
    { id: 8, left: '89%', delay: '7s', duration: '15s', size: 'w-2 h-2', opacity: '0.25' },
    { id: 9, left: '96%', delay: '5s', duration: '16s', size: 'w-1.5 h-1.5', opacity: '0.2' },
  ];

  return (
    <div ref={layerRef}
      aria-hidden="true" 
      className="falling-petals fixed inset-0 pointer-events-none overflow-hidden z-20 select-none"
    >
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
          className={`absolute -top-4 ${p.size} animate-petal-fall`}
        >
          {/* Micro Petal SVG Shape */}
          <svg viewBox="0 0 30 30" fill="none" className="w-full h-full transform rotate-45">
            <path
              d="M15 0 C25 10 25 25 15 30 C5 25 5 10 15 0 Z"
              fill="#DFBE7A"
              fillOpacity="0.8"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
