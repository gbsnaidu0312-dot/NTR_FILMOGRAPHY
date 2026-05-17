import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroWallpaper from '../assets/NTR.jpg';
import tigerIcon from '../assets/Tigericon.jpg';

import { SOCIAL_LINKS } from '../config/links';

import {
  FilmReelIcon,
  CameraIcon,
  ClapperboardIcon,
  PlayIcon,
  InstagramIcon,
  YoutubeIcon,
  XIcon,
  ChevronRight,
  ScrollDownArrow,
} from '../assets/icons';

export const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.6 + i * 0.15,
        duration: 0.7,
        ease: 'easeOut',
      },
    }),
  };

  const cards = [
    {
      title: 'MOVIES',
      path: '/movies',
      icon: <FilmReelIcon width={40} height={40} />,
      cardClass: 'hero-card-gold',
      iconGlow: 'icon-glow-gold',
      items: [
        { label: 'Filmography', path: '/movies' },
        { label: 'Movie Posters', path: '/movies' },
        { label: 'Songs', path: '/movies' },
      ],
    },
    {
      title: 'PHOTOS',
      path: '/photos',
      icon: <CameraIcon width={40} height={40} />,
      cardClass: 'hero-card-pink',
      iconGlow: 'icon-glow-pink',
      items: [
        { label: 'Movies', path: '/photos' },
        { label: 'Events', path: '/photos' },
        { label: 'Offline', path: '/photos' },
      ],
    },
    {
      title: 'VIDEO CUTS',
      path: '/video-cuts',
      icon: <ClapperboardIcon width={40} height={40} />,
      cardClass: 'hero-card-blue',
      iconGlow: 'icon-glow-blue',
      items: [
        { label: 'Video Songs', path: '/video-cuts' },
        { label: 'Movie Cuts', path: '/video-cuts' },
      ],
    },
    {
      title: 'VIDEOS',
      path: '/videos',
      icon: <PlayIcon width={40} height={40} />,
      cardClass: 'hero-card-red',
      iconGlow: 'icon-glow-red',
      items: [
        { label: 'Events & Ads', path: '/videos' },
        { label: 'Celebrations', path: '/videos' },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroWallpaper})`,
        }}
      />

      {/* Dark Gradient Overlay - lighter for better wallpaper visibility */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(10,14,39,0.45) 0%, rgba(10,14,39,0.35) 35%, rgba(10,14,39,0.15) 60%, rgba(10,14,39,0.25) 100%)',
        }}
      />

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={tigerIcon} alt="Tiger" className="w-9 h-9 rounded-full object-cover" />
          <div className="flex flex-col">
            <span
              className="text-gold font-bold text-sm tracking-[0.25em] leading-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              NTR
            </span>
            <span className="text-gray-400 text-[10px] tracking-[0.2em] leading-tight">
              FILMOGRAPHY
            </span>
          </div>
        </Link>

        {/* Social Icons */}
        <div className="flex items-center gap-5">
          <a
            href={SOCIAL_LINKS.INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gold transition-colors duration-300"
          >
            <InstagramIcon />
          </a>
          <a
            href={SOCIAL_LINKS.YOUTUBE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gold transition-colors duration-300"
          >
            <YoutubeIcon />
          </a>
          <a
            href={SOCIAL_LINKS.X}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gold transition-colors duration-300"
          >
            <XIcon />
          </a>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-80px)] px-6 md:px-12 pb-16 md:pb-24"
      >
        {/* Title Section */}
        <motion.div variants={itemVariants} className="mb-10 md:mb-14">
          {/* <p
            className="text-gold text-xs md:text-sm tracking-[0.4em] mb-2 md:mb-3"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            N T RAMARAO Jr.
          </p> */}
         
          <h2
            className="text-gold leading-none mb-3"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(2rem, 5vw, 5rem)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textShadow: `
                -1px -1px 0 rgba(0, 0, 0, 0.3),
                1px -1px 0 rgba(0, 0, 0, 0.3),
                -1px 1px 0 rgba(0, 0, 0, 0.3),
                1px 1px 0 rgba(212, 175, 55, 0.3),
                0 0 15px rgba(212, 175, 55, 0.4),
                0 0 30px rgba(212, 175, 55, 0.3)
              `,
              filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.3))',
            }}
          >
            NANDAMURI TARAKA
          </h2>
           <h1
            className="text-gold leading-none mb-1"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(4rem, 11vw, 9rem)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textShadow: `
                -1px -1px 0 rgba(0, 0, 0, 0.35),
                1px -1px 0 rgba(3, 3, 3, 0.35),
                -1px 1px 0 rgba(0, 0, 0, 0.35),
                1px 1px 0 rgba(212, 175, 55, 0.35),
                0 0 20px rgba(212, 175, 55, 0.5),
                0 0 35px rgba(212, 175, 55, 0.4),
                0 0 50px rgba(212, 175, 55, 0.25)
              `,
              filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.4))',
            }}
          >
            RAMARAO
          </h1>
          <p
            className="text-gold"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              textShadow: `
                -1px -1px 0 rgba(14, 14, 14, 0.4),
                1px -1px 0 rgba(9, 9, 8, 0.4),
                -1px 1px 0 rgba(13, 13, 13, 0.4),
                1px 1px 0 rgba(212, 175, 55, 0.4),
                0 0 10px rgba(212, 175, 55, 0.5),
                0 0 20px rgba(212, 175, 55, 0.4),
                0 0 30px rgba(212, 175, 55, 0.3)
              `,
              filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.35))',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            — The Man of Masses, The Pride of Millions.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl items-stretch">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.04, y: -6 }}
              className="group h-full"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div
                className={`${card.cardClass} card-shine rounded-xl p-5 md:p-6 backdrop-blur-sm transition-all duration-500 h-full min-h-[260px] md:min-h-[280px] flex flex-col`}
              >
                {/* Icon with Glow */}
                <div className="flex justify-center mb-4">
                  <div className={`${card.iconGlow} p-3 rounded-full bg-black/30`}>
                    {card.icon}
                  </div>
                </div>

                {/* Title */}
                <Link to={card.path} className="block mb-4">
                  <h3
                    className="text-center text-gold font-bold text-sm md:text-base tracking-wider hover:text-golden transition-colors"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {card.title}
                  </h3>
                </Link>

                {/* Items */}
                <div className="space-y-2 mt-auto">
                  {card.items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="flex items-center justify-between text-gray-400 text-xs md:text-sm hover:text-gold transition-colors duration-300 group/item"
                    >
                      <span>{item.label}</span>
                      <span className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 text-gold">
                        <ChevronRight />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-10 md:mt-14 flex flex-col items-center"
        >
          <p
            className="text-gray-500 text-[10px] tracking-[0.3em] mb-2"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            SCROLL TO EXPLORE
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ScrollDownArrow />
          </motion.div>
        </motion.div> */}
      </motion.div>
    </div>
  );
};
