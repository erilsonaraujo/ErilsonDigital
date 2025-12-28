'use client';

import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '@/constants';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(3);
      else if (window.innerWidth >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, itemsPerPage]);

  const maxIndex = Math.ceil(TESTIMONIALS.length / itemsPerPage) - 1;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const visibleTestimonials = TESTIMONIALS.slice(
    currentIndex * itemsPerPage,
    (currentIndex * itemsPerPage) + itemsPerPage
  );

  // Fill with start if near end to always show full grid (optional circular logic could be more complex, keeping it simple)
  // Simple pagination logic for now.

  return (
    <section className="py-24 bg-slate-50 dark:bg-dark-900 border-t border-slate-200 dark:border-dark-800 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Confiança do Mercado
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Mais de 20 clientes satisfeitos. Veja o que CTOs, Fundadores e Gestores dizem sobre minhas entregas.
          </p>
        </div>

        <div
          className="relative"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            e.currentTarget.dataset.touchStartX = touch.clientX.toString();
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            e.currentTarget.dataset.touchEndX = touch.clientX.toString();
          }}
          onTouchEnd={(e) => {
            const startX = parseFloat(e.currentTarget.dataset.touchStartX || '0');
            const endX = parseFloat(e.currentTarget.dataset.touchEndX || '0');
            if (!startX || !endX) return;

            const diff = startX - endX;
            if (diff > 50) nextSlide();
            if (diff < -50) prevSlide();

            e.currentTarget.dataset.touchStartX = '';
            e.currentTarget.dataset.touchEndX = '';
          }}
        >
          {/* Controls */}
          <div className="flex justify-end gap-2 mb-4 md:absolute md:-top-24 md:right-0">
            <button onClick={prevSlide} className="p-2 rounded-full border border-slate-300 dark:border-dark-700 hover:bg-white dark:hover:bg-dark-800 transition-colors z-10">
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <button onClick={nextSlide} className="p-2 rounded-full border border-slate-300 dark:border-dark-700 hover:bg-white dark:hover:bg-dark-800 transition-colors z-10">
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Grid/Carousel View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
            {visibleTestimonials.map((t) => (
              <div key={t.id} className="glass-card p-8 rounded-2xl shadow-sm flex flex-col h-full animate-in fade-in duration-500">
                <div className="flex justify-between items-start mb-6">
                  <Quote className="w-8 h-8 text-primary-200 dark:text-primary-900/50" />
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm italic mb-8 leading-relaxed flex-grow">
                  "{t.content}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-50 dark:border-dark-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {t.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{t.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.role} @ {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-primary-600' : 'w-1.5 bg-slate-300 dark:bg-dark-700'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;