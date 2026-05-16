import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_CLASSES = [
  'bio-card-gold',
  'bio-card-blue',
  'bio-card-red',
  'bio-card-purple',
  'bio-card-pink',
  'bio-card-teal',
];

// Helper function to transform bio.json slides to card format
const FALLBACK_IMAGE = 'https://ntrfilmography.live/sample/79.jpg';
const transformBioSlides = (slides) => {
  return slides.map((slide, index) => ({
    id: slide.slide,
    image: slide.banner_url || FALLBACK_IMAGE,
    orientation: slide.orientation || 'landscape',
    date: slide.date_year,
    title: slide.heading,
    description: slide.short_description,
    fullDescription: slide.long_description,
    cardClass: CARD_CLASSES[index % CARD_CLASSES.length],
  }));
};

const BioCard = ({ event, onClick }) => (
  <div
    onClick={onClick}
    className={`${event.cardClass} rounded-xl overflow-hidden flex-shrink-0 w-[340px] md:w-[400px] h-[180px] md:h-[200px] flex transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
  >
    {/* Image Section */}
    <div className="w-[40%] h-full relative overflow-hidden">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
    </div>

    {/* Content Section */}
    <div className="w-[60%] h-full p-4 md:p-5 flex flex-col justify-center">
      <span
        className="text-gold text-[10px] md:text-xs tracking-wider mb-1"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {event.date}
      </span>
      <h3
        className="text-white font-bold text-sm md:text-base mb-2"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {event.title}
      </h3>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-3">
        {event.description}
      </p>
    </div>
  </div>
);

const InfiniteMarquee = ({ bioEvents, onCardClick }) => {
  const duplicatedEvents = [...bioEvents, ...bioEvents];

  return (
    <div className="relative w-full overflow-hidden py-2">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />

      <div className="marquee-track">
        {duplicatedEvents.map((event, i) => (
          <div key={`${event.id}-${i}`} className="mx-3 md:mx-4">
            <BioCard event={event} onClick={() => onCardClick(event)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [selectedBio, setSelectedBio] = useState(null);
  const [bioEvents, setBioEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBioData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/bio.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load bio.json');
        const data = await response.json();
        const transformedEvents = transformBioSlides(data.slides);
        setBioEvents(transformedEvents);
      } catch (error) {
        console.error('Error loading bio.json:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBioData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark"
    >
      <HeroSection />

      {/* Bio Detail Modal */}
      <AnimatePresence>
        {selectedBio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBio(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`${selectedBio.cardClass} rounded-2xl overflow-hidden w-full max-w-lg flex flex-col md:flex-row`}
            >
              {/* Image Section */}
              <div className="w-full md:w-[45%] h-[200px] md:h-auto relative overflow-hidden">
                <img
                  src={selectedBio.image}
                  alt={selectedBio.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-black/50" />
              </div>

              {/* Content Section */}
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-center relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBio(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <span
                  className="text-gold text-xs tracking-wider mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {selectedBio.date}
                </span>
                <h3
                  className="text-white font-bold text-xl md:text-2xl mb-4"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {selectedBio.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {selectedBio.fullDescription || selectedBio.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Infinite Biography Marquee */}
      <section className="relative z-10 py-16 bg-charcoal overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 px-4"
        >
          <h2
            className="text-gold text-2xl md:text-3xl font-bold tracking-wider mb-2"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Biography of Jr NTR.
          </h2>
          <p className="text-gray-500 text-sm">
            A journey through the remarkable life of Jr. NTR
          </p>
        </motion.div>

        {!loading && bioEvents.length > 0 && <InfiniteMarquee bioEvents={bioEvents} onCardClick={setSelectedBio} />}

        {/* View Full Biography Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-12"
        >
          <a
            href="/biography"
            className="inline-block px-8 py-3 bg-gold/10 hover:bg-gold/20 text-gold font-bold uppercase tracking-wider rounded border border-gold/30 hover:border-gold/60 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
          >
            View Full Biography
          </a>
        </motion.div>
      </section>
    </motion.div>
  );
};
