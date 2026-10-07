import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import useDialog from '../hooks/useDialog';

export default function Gallery() {
  const { data } = useWeddingData();
  const gallery = data.gallery || [];
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const dialogRef = useRef(null);
  const touchRef = useRef(null);
  const closeLightbox = useCallback(() => setActivePhotoIndex(null), []);
  const isOpen = activePhotoIndex !== null && !!gallery[activePhotoIndex];
  useDialog(dialogRef, isOpen, closeLightbox);
  useEffect(() => {
    if (!isOpen) return;
    const main = document.querySelector('main');
    const previousInert = main.inert;
    main.inert = true;
    return () => { main.inert = previousInert; };
  }, [isOpen]);
  const changePhoto = (direction) => setActivePhotoIndex((index) => (index + direction + gallery.length) % gallery.length);

  return (
    <section id="gallery" className="py-12 sm:py-20 md:py-28 px-4 md:px-8 max-w-6xl mx-auto" aria-labelledby="gallery-title">
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-14 space-y-3" data-reveal="up">
        <h2 id="gallery-title" className="font-serif text-3xl md:text-5xl text-charcoal-900">Album ảnh kỷ niệm</h2>
        <p className="text-sm md:text-base text-charcoal-800/80">Những khoảnh khắc yêu thương của chúng mình.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {gallery.map((photo, index) => (
          <button type="button" key={`${photo.src}-${index}`} onClick={() => setActivePhotoIndex(index)}
            aria-label={`Xem ảnh ${index + 1}: ${photo.alt || 'Ảnh cưới'}`} data-reveal="up"
            className="gallery-photo group relative rounded-xl overflow-hidden shadow-soft bg-cream-200 aspect-[2/3] border border-champagne">
            <img src={photo.src} alt={photo.alt || 'Ảnh cưới'} loading="lazy" decoding="async" width="614" height="921"
              className="w-full h-full object-cover motion-safe:md:group-hover:scale-105 transition-transform duration-500" />
            <span aria-hidden="true" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-charcoal-900/60 text-white flex items-center justify-center"><Maximize2 size={14} /></span>
          </button>
        ))}
      </div>
      {gallery.length === 0 && <p className="text-center text-charcoal-800/70">Album ảnh sẽ được cập nhật sớm.</p>}
      {isOpen && createPortal(
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Xem album ảnh cưới" tabIndex={-1}
          onClick={closeLightbox}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); changePhoto(-1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); changePhoto(1); }
          }}
          onTouchStart={(event) => { const touch = event.touches[0]; touchRef.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null; }}
          onTouchEnd={(event) => {
            if (!touchRef.current) return;
            const touch = event.changedTouches[0];
            const dx = touch.clientX - touchRef.current.x;
            const dy = touch.clientY - touchRef.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) changePhoto(dx < 0 ? 1 : -1);
            touchRef.current = null;
          }}
          className="gallery-dialog fixed inset-0 z-50 bg-charcoal-900/95 flex flex-col items-center justify-center px-4 animate-fade-in">
          <button type="button" onClick={closeLightbox} aria-label="Đóng xem ảnh" className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center"><X size={22} /></button>
          <figure onClick={(event) => event.stopPropagation()} className="w-full max-w-4xl flex flex-col items-center">
            <img key={gallery[activePhotoIndex].src} src={gallery[activePhotoIndex].src} alt={gallery[activePhotoIndex].alt || 'Ảnh cưới'} className="max-w-full w-auto rounded-lg object-contain" />
            <figcaption className="text-center mt-4 text-white max-w-xl">
              <p className="font-serif text-base text-champagne">{gallery[activePhotoIndex].caption}</p>
              <span aria-live="polite" className="block mt-2 text-sm text-white/80">Ảnh {activePhotoIndex + 1} / {gallery.length}</span>
            </figcaption>
          </figure>
          <div className="absolute bottom-5 flex gap-5" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => changePhoto(-1)} aria-label="Ảnh trước" className="w-12 h-12 rounded-full bg-white/15 text-white grid place-items-center"><ChevronLeft size={24} /></button>
            <button type="button" onClick={() => changePhoto(1)} aria-label="Ảnh tiếp theo" className="w-12 h-12 rounded-full bg-white/15 text-white grid place-items-center"><ChevronRight size={24} /></button>
          </div>
        </div>, document.body
      )}
    </section>
  );
}
