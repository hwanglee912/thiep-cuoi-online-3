import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import useDialog from '../hooks/useDialog';

export default function Gallery() {
  const { data } = useWeddingData();
  const gallery = data.gallery || [];
  const findCover = () => Math.max(0, gallery.findIndex((photo) => data.galleryCoverId ? photo.id === data.galleryCoverId : photo.src === data.galleryCoverImage));
  const [selectedIndex, setSelectedIndex] = useState(findCover);
  const previousCover = useRef({ src: data.galleryCoverImage, id: data.galleryCoverId });
  const index = Math.min(selectedIndex, Math.max(0, gallery.length - 1));
  const photo = gallery[index];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const carouselRef = useRef(null);
  const stripRef = useRef(null);
  const dialogRef = useRef(null);
  const touchRef = useRef(null);
  const suppressClickUntil = useRef(0);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const isOpen = lightboxOpen && !!photo;
  useDialog(dialogRef, isOpen, closeLightbox);
  useEffect(() => {
    if (previousCover.current.src !== data.galleryCoverImage || previousCover.current.id !== data.galleryCoverId) {
      setSelectedIndex(Math.max(0, gallery.findIndex((photo) => data.galleryCoverId ? photo.id === data.galleryCoverId : photo.src === data.galleryCoverImage)));
      previousCover.current = { src: data.galleryCoverImage, id: data.galleryCoverId };
    } else setSelectedIndex((current) => Math.min(current, Math.max(0, gallery.length - 1)));
  }, [gallery, data.galleryCoverImage, data.galleryCoverId]);

  useEffect(() => {
    if (!isOpen) return;
    const main = document.querySelector('main');
    const previousInert = main.inert;
    main.inert = true;
    return () => { main.inert = previousInert; };
  }, [isOpen]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(carousel);
    return () => observer.disconnect();
  }, [gallery.length]);

  useEffect(() => {
    if (!nearViewport || gallery.length < 2) return;
    [-1, 1].forEach((direction) => {
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = 'low';
      image.src = gallery[(index + direction + gallery.length) % gallery.length].src;
    });
  }, [nearViewport, gallery, index]);

  useEffect(() => {
    const strip = stripRef.current;
    const thumbnail = strip?.children[index];
    if (!thumbnail) return;
    strip.scrollTo({
      left: thumbnail.offsetLeft - (strip.clientWidth - thumbnail.clientWidth) / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [index]);

  const changePhoto = (direction) => {
    if (gallery.length > 1) setSelectedIndex((current) => (Math.min(current, gallery.length - 1) + direction + gallery.length) % gallery.length);
  };
  const handleKeys = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); changePhoto(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); changePhoto(1); }
  };
  const startSwipe = (event) => {
    const touch = event.touches[0];
    touchRef.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const endSwipe = (event) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start || !event.changedTouches.length) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      suppressClickUntil.current = performance.now() + 400;
      if (event.cancelable) event.preventDefault();
      changePhoto(dx < 0 ? 1 : -1);
    }
  };

  return (
    <section id="gallery" className="py-12 sm:py-20 md:py-28 px-4 md:px-8 max-w-6xl mx-auto" aria-labelledby="gallery-title">
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 space-y-3" data-reveal="up">
        <h2 id="gallery-title" className="font-serif text-3xl md:text-5xl text-charcoal-900">Album ảnh kỷ niệm</h2>
        <p className="text-sm md:text-base text-charcoal-800/80">Những khoảnh khắc yêu thương của chúng mình.</p>
      </div>
      {photo ? <div ref={carouselRef} className="album-carousel" data-reveal="up" role="region" aria-roledescription="bộ ảnh" aria-label="Album ảnh cưới" onKeyDown={handleKeys}>
        <div className="album-stage" onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={() => { touchRef.current = null; }}>
          <button type="button" className="album-open" aria-label={`Phóng to ảnh ${index + 1}: ${photo.alt || 'Ảnh cưới'}`}
            onClick={() => { if (performance.now() >= suppressClickUntil.current) setLightboxOpen(true); }}>
            <img key={`${photo.src}-${index}`} src={photo.src} alt={photo.alt || 'Ảnh cưới'} loading="lazy" decoding="async" width="614" height="921" className="album-main-image" style={{ objectPosition: photo.imagePosition || '50% 35%' }} />
            <span aria-hidden="true" className="album-expand"><Maximize2 size={18} /></span>
          </button>
          {gallery.length > 1 && <>
            <button type="button" className="album-arrow album-arrow-prev" aria-label="Ảnh trước trong album" onClick={() => changePhoto(-1)}><ChevronLeft size={26} /></button>
            <button type="button" className="album-arrow album-arrow-next" aria-label="Ảnh tiếp theo trong album" onClick={() => changePhoto(1)}><ChevronRight size={26} /></button>
          </>}
        </div>
        <div ref={stripRef} className="album-thumbnails" aria-label="Chọn ảnh trong album">
          {gallery.map((item, itemIndex) => <button key={`${item.src}-${itemIndex}`} type="button" className="album-thumbnail" aria-pressed={index === itemIndex}
            aria-label={`Chọn ảnh ${itemIndex + 1}: ${item.alt || 'Ảnh cưới'}`} onClick={() => setSelectedIndex(itemIndex)}>
            <img src={item.src} alt="" loading="lazy" decoding="async" width="120" height="120" style={{ objectPosition: item.imagePosition || '50% 35%' }} />
          </button>)}
        </div>
        <p className="album-caption" aria-live="polite" aria-atomic="true"><span>{photo.caption}</span><span className="album-count">Ảnh {index + 1} / {gallery.length}</span></p>
      </div> : <p className="text-center text-charcoal-800/70">Album ảnh sẽ được cập nhật sớm.</p>}
      {isOpen && createPortal(
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Xem album ảnh cưới" tabIndex={-1}
          onClick={() => { if (performance.now() >= suppressClickUntil.current) closeLightbox(); }} onKeyDown={handleKeys}
          onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={() => { touchRef.current = null; }}
          className="gallery-dialog fixed inset-0 z-50 bg-charcoal-900/95 flex flex-col items-center justify-center px-4 animate-fade-in">
          <button type="button" onClick={closeLightbox} aria-label="Đóng xem ảnh" className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center"><X size={22} /></button>
          <figure onClick={(event) => event.stopPropagation()} className="w-full max-w-4xl flex flex-col items-center">
            <img key={`${photo.src}-${index}`} src={photo.src} alt={photo.alt || 'Ảnh cưới'} className="max-w-full w-auto rounded-lg object-contain" />
            <figcaption className="text-center mt-4 text-white max-w-xl">
              <p className="font-serif text-base text-champagne">{photo.caption}</p>
              <span aria-live="polite" className="block mt-2 text-sm text-white/80">Ảnh {index + 1} / {gallery.length}</span>
            </figcaption>
          </figure>
          {gallery.length > 1 && <div className="absolute bottom-5 flex gap-5" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => changePhoto(-1)} aria-label="Ảnh trước" className="w-12 h-12 rounded-full bg-white/15 text-white grid place-items-center"><ChevronLeft size={24} /></button>
            <button type="button" onClick={() => changePhoto(1)} aria-label="Ảnh tiếp theo" className="w-12 h-12 rounded-full bg-white/15 text-white grid place-items-center"><ChevronRight size={24} /></button>
          </div>}
        </div>, document.body
      )}
    </section>
  );
}
