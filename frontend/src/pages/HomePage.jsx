import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { motion, AnimatePresence } from 'framer-motion';
import { getR2Url } from '../config/links';

const bioEvents = [
  {
    id: 1,
    image: getR2Url('/wp5283563.jpg'),
    date: 'May 20, 1983',
    title: 'Birth',
    description: 'Born as Nandamuri Taraka Rama Rao in Hyderabad to Nandamuri Harikrishna and Shalini.',
    cardClass: 'bio-card-gold',
  },
  {
    id: 2,
    image: getR2Url('/wp5283563.jpg'),
    date: '2001',
    title: 'Debut Film',
    description: 'Made his acting debut with Ninnu Choodalani at the age of 18, marking the beginning of an era.',
    cardClass: 'bio-card-blue',
  },
  {
    id: 3,
    image: getR2Url('/wp5283563.jpg'),
    date: '2003',
    title: 'Simhadri Breakthrough',
    description: 'Delivered the blockbuster Simhadri, establishing himself as a mass action hero in Telugu cinema.',
    cardClass: 'bio-card-red',
  },
  {
    id: 4,
    image: getR2Url('/wp5283563.jpg'),
    date: '2007',
    title: 'Yamadonga Success',
    description: 'Starred in Yamadonga, showcasing his versatility and earning critical acclaim for his performance.',
    cardClass: 'bio-card-purple',
  },
  {
    id: 5,
    image: getR2Url('/wp5283563.jpg'),
    date: '2015',
    title: 'Temper Release',
    description: 'Temper became a major commercial success, further cementing his status as a top-tier star.',
    cardClass: 'bio-card-pink',
  },
  {
    id: 6,
    image: getR2Url('/wp5283563.jpg'),
    date: '2017',
    title: 'Jai Lava Kusa',
    description: 'Played triple roles in Jai Lava Kusa, demonstrating extraordinary acting range and dedication.',
    cardClass: 'bio-card-teal',
  },
  {
    id: 7,
    image: getR2Url('/wp5283563.jpg'),
    date: '2021',
    title: 'RRR Global Fame',
    description: 'RRR took the world by storm. His portrayal of Komaram Bheem earned international recognition.',
    cardClass: 'bio-card-gold',
  },
  {
    id: 8,
    image: getR2Url('/wp5283563.jpg'),
    date: '2024',
    title: 'Devara Release',
    description: 'Devara Part 1 released to massive anticipation, continuing his reign at the box office.',
    cardClass: 'bio-card-blue',
  },
];

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
        className="w-full h-full object-cover"
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

const InfiniteMarquee = ({ onCardClick }) => {
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
                  {selectedBio.description}
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

        <InfiniteMarquee onCardClick={setSelectedBio} />
      </section>
    </motion.div>
  );
};
