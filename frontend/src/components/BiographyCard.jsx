import React from 'react';
import { motion } from 'framer-motion';

const PLACEHOLDER_IMAGE = 'https://ntrfilmography.live/sample/79.jpg';

export const BiographyCard = ({ slide, index, onClick }) => {
  const imageUrl = slide.photo_related ? PLACEHOLDER_IMAGE : PLACEHOLDER_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer h-full"
    >
      <div className="relative h-full bg-dark-lighter rounded-lg overflow-hidden border border-gold/30 hover:border-gold/60 transition-all duration-300 shadow-lg hover:shadow-gold/20">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-dark">
          <img
            src={imageUrl}
            alt={slide.heading}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="p-5 h-[calc(100%-12rem)] flex flex-col">
          {/* Year/Date */}
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-bold tracking-wider rounded-full border border-gold/30">
              {slide.date_year}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold text-gold mb-2 line-clamp-2 group-hover:text-gold/80 transition-colors"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {slide.heading}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-gray-300 line-clamp-3 flex-grow">
            {slide.short_description}
          </p>

          {/* Read More Button */}
          <div className="mt-4 pt-4 border-t border-gold/20">
            <button className="text-gold text-xs font-bold uppercase tracking-wider hover:text-gold/80 transition-colors flex items-center gap-2 group/btn">
              Read More
              <span className="inline-block group-hover/btn:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};
