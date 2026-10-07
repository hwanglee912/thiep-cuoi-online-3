import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';

export default function Gallery() {
  const { data } = useWeddingData();
  const gallery = data.gallery || [];
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  const openLightbox = (index) => {
    setActivePhotoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <section id="gallery" className="py-16 sm:py-20 md:py-32 px-3 sm:px-6 md:px-8 max-w-6xl mx-auto">
      {/* Editorial Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-20 space-y-2.5 sm:space-y-3">
        <span className="font-serif italic text-gold-600 text-base sm:text-lg md:text-xl font-normal">
          Captured Moments
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-charcoal-900 font-normal">
          Album Ảnh Kỷ Niệm
        </h2>
        <p className="font-sans text-xs sm:text-sm md:text-base text-charcoal-800/70 font-light max-w-xl mx-auto px-2">
          Từng tấm ảnh là một lát cắt thời gian đầy cảm xúc, lưu giữ trọn vẹn tình yêu và nụ cười của chúng mình.
        </p>
        <div className="w-12 sm:w-16 h-0.5 bg-gold-400 mx-auto mt-3" />
      </div>

      {/* Mobile-Optimized Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {gallery.map((photo, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-luxury transition-all duration-300 bg-cream-200 aspect-[3/4] border border-gold-200/50"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Subtle Gradient & Hover Card Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-4 text-white">
              <span className="font-serif italic text-xs sm:text-sm text-champagne line-clamp-1">
                {photo.caption}
              </span>
              <p className="text-[10px] sm:text-xs text-white/80 font-sans tracking-wide mt-0.5 line-clamp-1">
                {photo.alt}
              </p>
            </div>

            {/* Expand badge icon */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-charcoal-900/40 backdrop-blur-sm text-white/90 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300 shadow">
              <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhotoIndex !== null && gallery[activePhotoIndex] && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-charcoal-900/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 animate-fade-in"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Đóng xem ảnh"
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={prevPhoto}
            aria-label="Ảnh trước"
            className="absolute left-2 sm:left-6 md:left-8 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Main Photo Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center px-4"
          >
            <img
              src={gallery[activePhotoIndex].src}
              alt={gallery[activePhotoIndex].alt}
              className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full rounded-xl sm:rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <div className="text-center mt-3 text-white">
              <p className="font-serif italic text-sm sm:text-base md:text-lg text-champagne">
                {gallery[activePhotoIndex].caption}
              </p>
              <span className="text-[11px] sm:text-xs text-white/60 tracking-widest font-sans uppercase">
                {activePhotoIndex + 1} / {gallery.length}
              </span>
            </div>
          </div>

          {/* Navigation Next */}
          <button
            onClick={nextPhoto}
            aria-label="Ảnh tiếp theo"
            className="absolute right-2 sm:right-6 md:right-8 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
