import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';

export default function CoupleIntro() {
  const { data } = useWeddingData();
  const { groom, bride, quote } = data.couple;

  return (
    <section id="couple" className="py-24 md:py-36 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Editorial Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-3">
        <span className="font-serif italic text-gold-600 text-lg md:text-xl font-normal">
          Our Love Story
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal-900 font-normal">
          Cô Dâu & Chú Rể
        </h2>
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4" />
      </div>

      {/* Couple Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Chú rể - Groom */}
        <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl glass-card hover:shadow-luxury transition-all duration-500 group">
          <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-champagne shadow-md mb-6">
            <img 
              src={groom.avatar} 
              alt={groom.fullName} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-charcoal-900/75 backdrop-blur-sm text-[11px] font-sans tracking-widest text-champagne uppercase">
              {groom.role}
            </div>
          </div>

          <span className="font-serif italic text-gold-600 text-sm tracking-wider">Groom</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-semibold mt-1">
            {groom.fullName}
          </h3>
          <p className="font-sans text-xs text-charcoal-800/60 uppercase tracking-widest mt-1">
            Đại diện nhà trai
          </p>
          <p className="font-sans text-sm text-charcoal-800/80 mt-4 leading-relaxed font-light max-w-sm">
            {groom.bio}
          </p>
        </div>

        {/* Cô dâu - Bride */}
        <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl glass-card hover:shadow-luxury transition-all duration-500 group">
          <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-champagne shadow-md mb-6">
            <img 
              src={bride.avatar} 
              alt={bride.fullName} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-charcoal-900/75 backdrop-blur-sm text-[11px] font-sans tracking-widest text-champagne uppercase">
              {bride.role}
            </div>
          </div>

          <span className="font-serif italic text-gold-600 text-sm tracking-wider">Bride</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-semibold mt-1">
            {bride.fullName}
          </h3>
          <p className="font-sans text-xs text-charcoal-800/60 uppercase tracking-widest mt-1">
            Đại diện nhà gái
          </p>
          <p className="font-sans text-sm text-charcoal-800/80 mt-4 leading-relaxed font-light max-w-sm">
            {bride.bio}
          </p>
        </div>
      </div>

      {/* Romantic Quote Banner */}
      <div className="mt-16 md:mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-cream-100 via-white to-cream-200 border border-champagne/70 shadow-soft text-center relative overflow-hidden">
        <div className="absolute top-4 left-6 text-gold-300/40 text-7xl font-serif select-none pointer-events-none">&ldquo;</div>
        <div className="absolute bottom-2 right-6 text-gold-300/40 text-7xl font-serif select-none pointer-events-none">&rdquo;</div>

        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <Sparkles className="w-6 h-6 text-gold-500 mx-auto" />
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-charcoal-900 leading-relaxed font-normal">
            {quote}
          </p>
          <p className="font-script text-2xl sm:text-3xl text-gold-600 pt-2">
            Đức Anh & Thu Uyên
          </p>
        </div>
      </div>
    </section>
  );
}
