import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function CalendarWidget({ targetDay = 26 }) {
  // Calendar days for November 2026 (Nov 1 is Sunday, index 6 in Monday-first week)
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  // 6 empty slots before Nov 1 (which falls on CN/Sunday)
  const emptyDays = [null, null, null, null, null, null];
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-7 rounded-3xl glass-card border border-champagne/80 shadow-soft text-center">
      {/* Month Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-3.5 h-3.5 text-gold-500" />
        <span className="font-serif font-bold text-base sm:text-lg text-charcoal-900 tracking-widest uppercase">
          Tháng 11 &bull; 2026
        </span>
        <Sparkles className="w-3.5 h-3.5 text-gold-500" />
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 text-[11px] font-sans font-semibold text-charcoal-800/60 pb-2 border-b border-champagne/50">
        {daysOfWeek.map((dow, idx) => (
          <div key={idx} className={idx === 6 ? 'text-rosewood font-bold' : ''}>
            {dow}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 pt-3 text-xs sm:text-sm font-sans font-medium text-charcoal-800">
        {emptyDays.map((_, idx) => (
          <div key={`empty-${idx}`} className="h-8 flex items-center justify-center text-transparent">
            -
          </div>
        ))}

        {daysInMonth.map((day) => {
          const isSelected = day === targetDay;

          return (
            <div
              key={day}
              className="h-8 relative flex items-center justify-center"
            >
              {isSelected ? (
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gold-500 text-white font-bold shadow-md animate-heart-pulse">
                  <span>{day}</span>
                  {/* Subtle Heart badge indicator */}
                  <Heart className="absolute -top-1 -right-1 w-3 h-3 text-rosewood fill-rosewood" />
                </div>
              ) : (
                <span className="text-charcoal-800/80 hover:text-gold-600 transition-colors">
                  {day}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Romantic quotation inspired by reference template */}
      <div className="mt-5 pt-4 border-t border-champagne/40">
        <p className="font-serif italic text-xs sm:text-sm text-charcoal-800/80 font-normal">
          &ldquo;Hôn nhân là chuyện cả đời, yêu người vừa ý, cưới người mình thương...&rdquo;
        </p>
      </div>
    </div>
  );
}
