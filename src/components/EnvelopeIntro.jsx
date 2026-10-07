import React, { useEffect, useRef, useState } from 'react';
import { Mail, Sparkles, Heart } from 'lucide-react';
import useDialog from '../hooks/useDialog';

export default function EnvelopeIntro({ onOpen, onStart, coupleNames, date }) {
  const [isOpening, setIsOpening] = useState(false);
  const dialogRef = useRef(null);
  const startedRef = useRef(false);
  useDialog(dialogRef, true);

  useEffect(() => {
    if (!isOpening) return;
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
    const timer = setTimeout(onOpen, delay);
    return () => clearTimeout(timer);
  }, [isOpening, onOpen]);

  const handleOpen = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setIsOpening(true);
    onStart?.();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      import('canvas-confetti').then(({ default: confetti }) => confetti({
        particleCount: window.innerWidth < 768 ? 35 : 60, spread: 70, origin: { y: 0.5 },
        colors: ['#DFBE7A', '#B88D37', '#FAF6EE', '#CFA453'], disableForReducedMotion: true,
      })).catch(() => {});
    }
  };

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="envelope-title" tabIndex={-1}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/95 overflow-y-auto transition-opacity duration-700 ${
        isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative max-w-sm sm:max-w-md w-full bg-[#FAF6EE] rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-champagne text-center flex flex-col items-center">
        {/* Ornate corner borders */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-400 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-400 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-400 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-400 rounded-br-xl pointer-events-none" />

        {/* Wax Seal Graphic */}
        <div className="relative my-4 w-20 h-20 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-300 flex items-center justify-center shadow-lg border-2 border-white">
          <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          <div className="absolute -inset-1 rounded-full border border-gold-400/40 animate-ping pointer-events-none" />
        </div>

        {/* Envelope typography */}
        <p className="font-serif italic text-gold-700 text-sm tracking-widest uppercase mt-2">
          Wedding Invitation
        </p>

        <h2 id="envelope-title" className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal my-2">
          {coupleNames}
        </h2>

        <p className="font-sans text-sm tracking-widest text-charcoal-800/80 uppercase">
          {date}
        </p>

        <p className="font-sans text-xs text-charcoal-800/80 my-5 font-light leading-relaxed max-w-xs">
          Trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng mình!
        </p>

        {/* Main Open Button */}
        <button
          onClick={handleOpen}
          disabled={isOpening}
          className="w-full py-4 px-6 rounded-full bg-charcoal-900 hover:bg-gold-600 text-white font-medium text-sm tracking-wider uppercase shadow-luxury hover:scale-102 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Mail className="w-4 h-4 text-champagne group-hover:rotate-12 transition-transform" />
          <span>MỞ THIỆP CƯỚI</span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        </button>
      </div>
    </div>
  );
}
