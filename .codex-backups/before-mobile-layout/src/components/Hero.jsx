import React, { useState, useEffect } from 'react';
import { Calendar, Heart, ChevronDown } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';

export default function Hero() {
  const { data } = useWeddingData();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(data.targetDate || "2026-11-26T17:30:00").getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.targetDate]);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 md:px-8 text-center vintage-texture overflow-hidden"
    >
      {/* Ambient warm glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-champagne-light/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gold-300/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Editorial Header */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* TĂNG KÍCH CỠ CHỮ SAVE OUR DATE THÊM 1 TÍ, NGÀY THÁNG Ở DƯỚI */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-serif italic text-gold-600 text-lg sm:text-xl md:text-2xl tracking-[0.32em] font-normal uppercase">
            Save Our Date
          </span>
          <span className="font-serif text-charcoal-900 text-xl sm:text-2xl md:text-3xl tracking-[0.22em] font-semibold border-b border-gold-400/60 pb-1 px-5">
            26.11.2026
          </span>
        </div>

        {/* TÊN 2 NGƯỜI THU NHỎ LẠI, DẤU & NẰM VỪA VẶN TRONG Ô VUÔNG GIỮA 2 TÊN */}
        <div className="relative mt-6 sm:mt-7 mb-4 flex flex-col items-center justify-center">
          {/* Dấu & nhỏ gọn, đặt chuẩn xác trong ô vuông giữa 2 dòng tên */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-script text-gold-500/30 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none select-none transform translate-y-0.5">
              &
            </span>
          </div>

          {/* Tên cô dâu chú rể thu nhỏ tinh tế theo phong cách EB Garamond */}
          <h1 className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5 font-serif text-base sm:text-xl md:text-2xl lg:text-3xl font-medium text-charcoal-900 tracking-[0.2em] uppercase leading-tight">
            <span>{data.couple.groom.name}</span>
            <span>{data.couple.bride.name}</span>
          </h1>
        </div>

        <p className="font-sans text-charcoal-800/80 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed px-2">
          Chúng mình trân trọng kính mời bạn đến chung vui và chứng kiến khoảnh khắc khởi đầu cho một hành trình mới ngập tràn yêu thương.
        </p>
      </div>

      {/* Centerpiece Couple Visual */}
      <div className="my-8 sm:my-10 relative max-w-sm sm:max-w-md md:max-w-lg mx-auto w-full group px-2">
        <div className="relative mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-luxury aspect-[3/4] max-h-[460px]">
          <img 
            src={data.couple.heroImage} 
            alt="Đức Anh và Thu Uyên" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white text-left">
            <span className="font-script text-2xl sm:text-3xl text-champagne-light drop-shadow">We are getting married</span>
            <p className="font-sans text-[11px] sm:text-xs text-white/90 mt-0.5 font-light tracking-wider">
              Khởi đầu của hạnh phúc trăm năm
            </p>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -top-2 -right-1 sm:-top-3 sm:-right-3 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-r-2 border-gold-400 rounded-tr-2xl pointer-events-none" />
        <div className="absolute -bottom-2 -left-1 sm:-bottom-3 sm:-left-3 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-l-2 border-gold-400 rounded-bl-2xl pointer-events-none" />
      </div>

      {/* Countdown Timer */}
      <div className="max-w-md sm:max-w-lg mx-auto w-full mb-8 sm:mb-10 px-2">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-4 p-3 sm:p-5 rounded-2xl glass-card shadow-soft">
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-4xl font-semibold text-charcoal-900">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] font-sans tracking-widest uppercase text-charcoal-800/70 mt-0.5">
              Ngày
            </span>
          </div>
          <div className="flex flex-col items-center border-l border-champagne/60">
            <span className="font-serif text-2xl sm:text-4xl font-semibold text-charcoal-900">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] font-sans tracking-widest uppercase text-charcoal-800/70 mt-0.5">
              Giờ
            </span>
          </div>
          <div className="flex flex-col items-center border-l border-champagne/60">
            <span className="font-serif text-2xl sm:text-4xl font-semibold text-charcoal-900">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] font-sans tracking-widest uppercase text-charcoal-800/70 mt-0.5">
              Phút
            </span>
          </div>
          <div className="flex flex-col items-center border-l border-champagne/60">
            <span className="font-serif text-2xl sm:text-4xl font-semibold text-gold-600">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[11px] font-sans tracking-widest uppercase text-charcoal-800/70 mt-0.5">
              Giây
            </span>
          </div>
        </div>
      </div>

      {/* Two High-Contrast CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none px-4">
        <a 
          href="#events" 
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-charcoal-900 text-white font-medium hover:bg-gold-600 transition-all duration-300 shadow-md hover:shadow-luxury text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4 text-champagne" />
          <span>Xem 2 Ngày Tiệc Cưới</span>
        </a>

        <a 
          href="#rsvp" 
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-charcoal-900 font-medium border border-gold-400 hover:bg-cream-100 transition-all duration-300 shadow-sm text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 text-gold-500 fill-gold-500" />
          <span>Gửi Lời Chúc Phúc</span>
        </a>
      </div>

      {/* Gentle Scroll Down Indicator */}
      <a 
        href="#events" 
        className="mt-10 sm:mt-12 inline-flex flex-col items-center gap-1 text-charcoal-800/60 hover:text-gold-600 transition-colors"
        aria-label="Cuộn xuống xem tiếp"
      >
        <span className="text-[10px] font-sans tracking-widest uppercase">Khám phá tiếp</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </a>
    </section>
  );
}
