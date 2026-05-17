import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiographyCard } from '../components/BiographyCard';
import { BiographyModal } from '../components/BiographyModal';

export const BiographyPage = () => {
  const [bioData, setBioData] = useState(null);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBioData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/bio.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load biography data');
        const data = await response.json();
        setBioData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading bio.json:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBioData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold">Loading biography...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-gold/20 to-transparent overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gold mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            The Man of Masses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl"
          >
            Jr NTR's extraordinary journey from a child artist to a global cinematic phenomenon
          </motion.p>
        </div>
      </div>

      {/* Biography Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl items-stretch"
        >
          {bioData?.slides?.map((slide, index) => (
            <BiographyCard
              key={slide.slide}
              slide={slide}
              index={index}
              onClick={() => setSelectedSlide(slide)}
            />
          ))}
        </motion.div>
      </div>

      {/* Biography Modal */}
      <AnimatePresence>
        {selectedSlide && (
          <BiographyModal
            slide={selectedSlide}
            onClose={() => setSelectedSlide(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
