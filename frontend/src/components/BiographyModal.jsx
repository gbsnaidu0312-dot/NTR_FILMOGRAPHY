import React from 'react';
import { motion } from 'framer-motion';

const PLACEHOLDER_IMAGE = 'https://ntrfilmography.live/sample/79.jpg';

export const BiographyModal = ({ slide, onClose }) => {
  const imageUrl = slide.photo_related ? PLACEHOLDER_IMAGE : PLACEHOLDER_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-lighter rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold/30 shadow-2xl"
      >
        {/* Image */}
        <div className="relative h-72 md:h-96 overflow-hidden bg-dark">
          <img
            src={imageUrl}
            alt={slide.heading}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-lighter via-transparent to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-dark/80 hover:bg-dark/95 rounded-full flex items-center justify-center text-gold hover:text-gold/80 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Year and Slide Number */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block px-4 py-2 bg-gold/10 text-gold text-sm font-bold tracking-wider rounded-full border border-gold/30">
              {slide.date_year}
            </span>
            <span className="text-gold/60 text-sm font-bold">
              Slide {slide.slide} of 43
            </span>
          </div>

          {/* Title */}
          <h2
            className="text-3xl md:text-4xl font-bold text-gold mb-6"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {slide.heading}
          </h2>

          {/* Short Description */}
          <p className="text-gold/80 text-sm font-semibold mb-4 uppercase tracking-wider">
            {slide.short_description}
          </p>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gold/20 to-transparent mb-6"></div>

          {/* Long Description */}
          <div className="space-y-4">
            <p className="text-gray-300 text-base leading-relaxed">
              {slide.long_description}
            </p>
          </div>

          {/* Photo Related Info */}
          {slide.photo_related && (
            <div className="mt-6 p-4 bg-gold/5 rounded border border-gold/20">
              <p className="text-xs text-gold/60 mb-2 uppercase tracking-wider font-bold">Recommended Photo</p>
              <p className="text-sm text-gold/80">{slide.photo_related}</p>
            </div>
          )}

          {/* Close Button at Bottom */}
          <div className="mt-8 pt-6 border-t border-gold/20">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gold/10 hover:bg-gold/20 text-gold font-bold uppercase tracking-wider rounded transition-colors border border-gold/30 hover:border-gold/60"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
