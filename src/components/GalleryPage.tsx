import React, { useState, useEffect } from 'react';
import { Language, UI_TEXT } from '../data/articlesData';
import { GalleryPhoto, GALLERY_PHOTOS } from '../data/galleryData';
import { ResilientImage } from './ResilientImage';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize2,
  X
} from 'lucide-react';

interface GalleryPageProps {
  lang: Language;
  onNavigateHome: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  lang,
  onNavigateHome
}) => {
  const isEs = lang === 'es';
  const t = UI_TEXT[lang];

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const activePhoto: GalleryPhoto | null =
    activePhotoIndex !== null ? GALLERY_PHOTOS[activePhotoIndex] : null;

  const handleNext = () => {
    if (activePhotoIndex !== null && GALLERY_PHOTOS.length > 1) {
      setActivePhotoIndex((activePhotoIndex + 1) % GALLERY_PHOTOS.length);
    }
  };

  const handlePrev = () => {
    if (activePhotoIndex !== null && GALLERY_PHOTOS.length > 1) {
      setActivePhotoIndex(
        (activePhotoIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
      );
    }
  };

  // Keyboard navigation for Fullscreen View
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  return (
    <div className="flex-1 pb-16">
      {/* Gallery Page Header */}
      <section className="bg-white border-b border-[#E2E2DC] py-6 sm:py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#0051FF] mb-1.5 font-semibold">
            {isEs ? 'REGISTRO VISUAL' : 'VISUAL ARCHIVE'}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#111315] font-extrabold tracking-tight">
            {isEs ? 'Galería' : 'Gallery'}
          </h1>
        </div>
      </section>

      {/* Individual Photo Display */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className={GALLERY_PHOTOS.length === 1 ? 'max-w-3xl mx-auto' : 'grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8'}>
          {GALLERY_PHOTOS.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className="group bg-white border border-[#E2E2DC] hover:border-[#0051FF] p-3 sm:p-5 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col"
            >
              {/* Photo */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-[#111315] overflow-hidden">
                <ResilientImage
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-300"
                  fallbackLabel={photo.alt}
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Small Date, Location, and Copyright Notice */}
              <div className="pt-3.5 flex flex-col gap-1.5 text-xs font-mono text-[#5A6065]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[#111315] font-medium text-xs sm:text-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#0051FF] shrink-0" />
                    <span>{photo.location[lang]}</span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0 text-[#71777D]">
                    <Calendar className="w-3.5 h-3.5 text-[#5A6065]" />
                    <span>{photo.date[lang]}</span>
                  </span>
                </div>

                {/* Copyright Notice */}
                {photo.copyright && (
                  <div className="text-[11px] text-[#8C9298] italic pt-1.5 border-t border-[#F0F0EC] mt-1 flex items-center justify-between">
                    <span>{photo.copyright}</span>
                    <span className="not-italic text-[#0051FF] text-[10px] uppercase font-semibold">
                      {isEs ? 'Ampliar Imagen' : 'Expand Photo'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Return Button */}
        <div className="mt-12 sm:mt-16 text-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#111315] hover:bg-[#0051FF] text-white text-xs sm:text-sm font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.returnToPortfolio}</span>
          </button>
        </div>
      </section>

      {/* Fullscreen Photo Modal */}
      {activePhoto !== null && activePhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Top Close / Title Bar */}
          <div
            className="flex items-center justify-between text-white pb-3 border-b border-white/15 max-w-6xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-mono text-xs text-white/70">
              {activePhoto.alt}
            </span>

            <button
              onClick={() => setActivePhotoIndex(null)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isEs ? 'Cerrar' : 'Close'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Fullscreen Image */}
          <div
            className="relative flex-1 flex items-center justify-center my-3 max-h-[75vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <ResilientImage
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="max-w-full max-h-full object-contain shadow-2xl"
              fallbackLabel={activePhoto.alt}
            />

            {/* Prev / Next Buttons (Only if multiple photos) */}
            {GALLERY_PHOTOS.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                  title={isEs ? 'Anterior' : 'Previous'}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                  title={isEs ? 'Siguiente' : 'Next'}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Small Details Bar */}
          <div
            className="max-w-2xl mx-auto w-full bg-[#111315]/90 border border-white/15 px-4 py-3 text-white text-xs font-mono flex flex-wrap items-center justify-between gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0051FF] shrink-0" />
              <span>{activePhoto.location[lang]}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-white/70">{activePhoto.date[lang]}</span>
              {activePhoto.copyright && (
                <span className="text-white/50 italic border-l border-white/20 pl-2">
                  {activePhoto.copyright}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
