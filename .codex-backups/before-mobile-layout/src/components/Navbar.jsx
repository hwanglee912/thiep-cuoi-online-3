import React, { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon, HeartHandshake, Home, Users, Music, VolumeX } from 'lucide-react';

export default function Navbar({ isPlaying, toggleMusic }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      // Simple active tab tracker
      const sections = ['hero', 'couple', 'events', 'gallery', 'rsvp'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveTab(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. TOP HEADER (DESKTOP: Full Pill | MOBILE: Clean Header with Monogram + Music Disc) */}
      <header className="fixed top-3 left-0 right-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none">
        <nav 
          className={`pointer-events-auto flex items-center justify-between w-full max-w-4xl px-4 py-2 sm:px-6 sm:py-2.5 rounded-full transition-all duration-500 ${
            scrolled 
              ? 'bg-white/90 backdrop-blur-md shadow-luxury border border-champagne/70' 
              : 'bg-white/70 backdrop-blur-sm border border-white/60 shadow-soft'
          }`}
        >
          {/* Monogram Brand */}
          <a 
            href="#hero" 
            className="font-serif text-lg sm:text-xl font-bold tracking-widest text-charcoal-900 hover:text-gold-500 transition-colors flex items-center gap-1.5"
          >
            <span className="gold-gradient-text font-serif italic text-2xl font-normal">HD</span>
            <span className="text-xs text-gold-500 font-light">&</span>
            <span className="gold-gradient-text font-serif italic text-2xl font-normal">TD</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-medium text-charcoal-800">
            <a 
              href="#events" 
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-colors ${
                activeTab === 'events' ? 'bg-cream-200 text-charcoal-900 font-semibold' : 'hover:bg-cream-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-gold-500" />
              <span>Hai Ngày Tiệc</span>
            </a>
            <a 
              href="#gallery" 
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-colors ${
                activeTab === 'gallery' ? 'bg-cream-200 text-charcoal-900 font-semibold' : 'hover:bg-cream-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-gold-500" />
              <span>Album Ảnh</span>
            </a>
            <a 
              href="#rsvp" 
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-500 text-white hover:bg-gold-600 transition-colors shadow-sm font-semibold ml-1"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Gửi Lời Chúc</span>
            </a>
          </div>

          {/* Single Audio Vinyl Controller */}
          <button
            onClick={toggleMusic}
            aria-label={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc nền"}
            className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all duration-300 ${
              isPlaying 
                ? 'border-gold-400 bg-charcoal-900 text-champagne shadow-sm' 
                : 'border-charcoal-800/20 bg-white text-charcoal-800/70 hover:border-gold-400'
            }`}
            title={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc nền"}
          >
            <div className={`${isPlaying ? 'animate-spin-slow' : ''}`}>
              <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-champagne" />
            </div>
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-500 animate-ping" />
            )}
          </button>
        </nav>
      </header>

      {/* 2. MOBILE BOTTOM FLOATING DOCK (Tối ưu cho thao tác 1 tay trên điện thoại) */}
      <nav 
        aria-label="Điều hướng nhanh trên điện thoại"
        className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-champagne/80 shadow-luxury rounded-2xl py-2 px-3 flex items-center justify-around"
      >
        <a 
          href="#hero" 
          className={`flex flex-col items-center gap-0.5 text-[10px] font-sans transition-colors ${
            activeTab === 'hero' ? 'text-gold-600 font-semibold' : 'text-charcoal-800/70'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Đầu trang</span>
        </a>

        <a 
          href="#events" 
          className={`flex flex-col items-center gap-0.5 text-[10px] font-sans transition-colors ${
            activeTab === 'events' ? 'text-gold-600 font-semibold' : 'text-charcoal-800/70'
          }`}
        >
          <Calendar className="w-4 h-4 text-gold-500" />
          <span>2 Ngày Tiệc</span>
        </a>

        <a 
          href="#gallery" 
          className={`flex flex-col items-center gap-0.5 text-[10px] font-sans transition-colors ${
            activeTab === 'gallery' ? 'text-gold-600 font-semibold' : 'text-charcoal-800/70'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Album</span>
        </a>

        <a 
          href="#rsvp" 
          className={`flex flex-col items-center gap-0.5 text-[10px] font-sans transition-colors ${
            activeTab === 'rsvp' ? 'text-gold-600 font-semibold' : 'text-charcoal-800/70'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-gold-500" />
          <span>Lời Chúc</span>
        </a>
      </nav>
    </>
  );
}
