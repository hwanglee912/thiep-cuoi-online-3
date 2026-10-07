import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Image as ImageIcon, HeartHandshake, Home, Users, Music, VolumeX } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';

const links = [
  { id: 'hero', label: 'Đầu trang', Icon: Home },
  { id: 'couple', label: 'Cặp đôi', Icon: Users },
  { id: 'events', label: 'Ngày tiệc', Icon: Calendar },
  { id: 'gallery', label: 'Album', Icon: ImageIcon },
  { id: 'rsvp', label: 'Lời chúc', Icon: HeartHandshake },
];
const initials = (name) => name.trim().split(/\s+/).slice(-2).map((word) => word[0]).join('');

export default function Navbar({ contentReady, isPlaying, toggleMusic }) {
  const { data } = useWeddingData();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveTab(entry.target.id); });
    }, { rootMargin: '-18% 0px -65% 0px', threshold: 0 });
    const observedIds = new Set();
    let additions;
    const observeSections = () => links.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section && !observedIds.has(id)) { sections.observe(section); observedIds.add(id); }
      if (observedIds.size === links.length) additions?.disconnect();
    });
    observeSections();
    // Lazy content can finish loading after the envelope starts its transition.
    additions = new MutationObserver(observeSections);
    additions.observe(document.querySelector('main'), { childList: true, subtree: true });
    const header = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    if (sentinelRef.current) header.observe(sentinelRef.current);
    return () => { sections.disconnect(); header.disconnect(); additions.disconnect(); };
  }, [contentReady]);
  const navLink = ({ id, label, Icon }, mobile) => (
    <a key={id} href={`#${id}`} aria-current={activeTab === id ? 'location' : undefined}
      className={mobile
        ? `flex flex-col items-center gap-1 text-[11px] transition-colors ${activeTab === id ? 'text-gold-700 font-semibold' : 'text-charcoal-800/80'}`
        : `flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-colors ${activeTab === id ? 'bg-cream-200 text-gold-700' : 'text-charcoal-800 hover:bg-cream-100'}`}>
      <Icon className="w-[18px] h-[18px] shrink-0" /><span>{label}</span>
    </a>
  );
  return (
    <>
      <div ref={sentinelRef} className="absolute top-[100px] left-0 w-px h-px pointer-events-none" aria-hidden="true" />
      <header className="hidden md:flex fixed top-3 left-0 right-0 z-40 justify-center px-3 sm:px-4 pointer-events-none">
        <nav aria-label="Điều hướng chính" className={`pointer-events-auto flex items-center justify-between w-full max-w-4xl px-4 py-1.5 rounded-full border bg-white/95 transition-colors ${scrolled ? 'border-champagne shadow-soft' : 'border-white/70'}`}>
          <a href="#hero" aria-label={`Thiệp cưới ${data.couple.groom.name} và ${data.couple.bride.name}`} className="flex items-center gap-1.5 min-h-11 font-serif text-gold-700">
            <span className="text-xl italic">{initials(data.couple.groom.name)}</span><span className="text-sm">&</span><span className="text-xl italic">{initials(data.couple.bride.name)}</span>
          </a>
          <div className="hidden md:flex items-center gap-1">{links.slice(1).map((link) => navLink(link, false))}</div>
          <button type="button" onClick={toggleMusic} aria-pressed={isPlaying} aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc nền'}
            className={`flex items-center justify-center w-11 h-11 rounded-full border transition-colors ${isPlaying ? 'border-gold-400 bg-charcoal-900 text-champagne' : 'border-champagne bg-white text-gold-700'}`}>
            {isPlaying ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </nav>
      </header>
      <nav aria-label="Điều hướng nhanh trên điện thoại" className="mobile-dock md:hidden fixed left-3 right-3 z-40 bg-white/95 border border-champagne shadow-soft rounded-2xl py-1 px-2 flex items-center justify-around">
        {links.map((link) => navLink(link, true))}
        <button type="button" onClick={toggleMusic} aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc nền'} aria-pressed={isPlaying}
          className="mobile-music flex flex-col items-center justify-center gap-1 text-[11px] text-gold-700">
          {isPlaying ? <Music size={18} /> : <VolumeX size={18} />}<span>Nhạc</span>
        </button>
      </nav>
    </>
  );
}
