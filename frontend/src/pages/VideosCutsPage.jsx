/**
 * VideosCutsPage — Landing page for /video-cuts
 * Displays two category cards: VIDEO SONGS and MOVIE CUTS.
 * Clicking a card navigates to /video-cuts/video-songs or /video-cuts/movie-cuts
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClapperboardIcon, PlayIcon } from '../assets/icons';
import { getR2Url } from '../config/links';
import ntrBg from '../assets/NTR.jpg';

const categories = [
  {
    id: 'video-songs',
    path: '/video-cuts/video-songs',
    title: 'VIDEO SONGS',
    subtitle: 'Full song videos from all films',
    icon: <PlayIcon width={40} height={40} />,
    gradient: 'from-blue-900/60 via-blue-800/40 to-blue-900/60',
    border: 'border-blue-500/30 hover:border-blue-400/60',
    iconColor: 'text-blue-400',
    glowColor: 'blue',
  },
  {
    id: 'movie-cuts',
    path: '/video-cuts/movie-cuts',
    title: 'MOVIE CUTS',
    subtitle: 'Best scenes & dialogue cuts',
    icon: <ClapperboardIcon width={40} height={40} />,
    gradient: 'from-red-900/60 via-red-800/40 to-red-900/60',
    border: 'border-red-500/30 hover:border-red-400/60',
    iconColor: 'text-red-400',
    glowColor: 'red',
  },
];

export const VideosCutsPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${ntrBg})` }} />
      <div className="absolute inset-0 bg-black/82 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-400 hover:text-amber-400 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <ClapperboardIcon width={36} height={36} />
            <h1
              className="text-4xl md:text-5xl font-bold text-amber-400 tracking-widest"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              VIDEO CUTS
            </h1>
          </div>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Explore Video Songs &amp; Movie Cuts from all films
          </p>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              onClick={() => navigate(cat.path)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.15 }}
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="group"
            >
              <div
                className={`bg-gradient-to-br ${cat.gradient} border ${cat.border} rounded-2xl p-10 flex flex-col items-center gap-4 transition-all duration-500 shadow-xl shadow-black/40`}
              >
                <div className={`${cat.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <div className="text-center">
                  <h2
                    className="text-amber-400 font-bold text-xl tracking-wider mb-1"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {cat.title}
                  </h2>
                  <p className="text-gray-400 text-xs">{cat.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 text-amber-400/60 text-xs group-hover:text-amber-400/90 transition-colors">
                  <span>Browse folders</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Decorative quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p
            className="text-amber-400/70 text-base italic"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            &ldquo;Every frame tells a story. Every cut creates magic.&rdquo;
          </p>
          <p className="text-amber-400/40 text-sm mt-1" style={{ fontFamily: "'Great Vibes', cursive" }}>Jr. NTR</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
