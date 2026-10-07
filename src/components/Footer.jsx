import React from 'react';
import { Heart, Sparkles, ArrowUp, Key } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import { formatWeddingDate, getPrimaryDate } from '../utils/weddingDate';

export default function Footer() {
  const { data, setIsAdminOpen } = useWeddingData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return (
    <footer className="relative bg-charcoal-900 text-white pt-20 pb-4 md:pb-16 px-4 md:px-8 overflow-hidden text-center">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <Sparkles className="w-6 h-6 text-gold-400 mx-auto" />

        <h3 className="font-script text-4xl sm:text-5xl md:text-6xl text-champagne">
          Thank You
        </h3>

        <p className="font-serif italic text-base sm:text-xl md:text-2xl text-cream-100 max-w-xl mx-auto font-light leading-relaxed">
          &ldquo;{data.thankYouMessage?.content}&rdquo;
        </p>

        <div className="pt-2 sm:pt-4 space-y-2">
          <p className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-gold-400 uppercase">
            {data.couple?.groom?.name} & {data.couple?.bride?.name}
          </p>
          <p className="font-sans text-[11px] sm:text-xs text-white/50 tracking-widest uppercase">
            {formatWeddingDate(getPrimaryDate(data))} &bull; Trân trọng cảm ơn!
          </p>
        </div>

        {/* Back to top button */}
        <div className="pt-6 sm:pt-10 flex items-center justify-center gap-3">
          <button
            onClick={scrollToTop}
            aria-label="Về đầu trang"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-champagne text-xs font-sans tracking-wider uppercase transition-all duration-300 border border-white/10 cursor-pointer"
          >
            <span>Về đầu trang</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer bottom & Discreet Admin Access Button */}
        <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70 font-sans">
          <span>Hẹn gặp bạn trong ngày vui của chúng mình.</span>
          
          <button
            onClick={() => setIsAdminOpen(true)}
            aria-label="Đăng nhập quản trị"
            className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 hover:text-champagne transition-colors text-xs text-white/70 cursor-pointer"
            title="Đăng nhập tài khoản admin để chỉnh sửa nội dung & ảnh"
          >
            <Key className="w-3 h-3 text-gold-400" />
            <span>Quản trị viên (Admin)</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
