import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TigerLogo } from '../assets/icons';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide navigation on immersive pages (home & movies & media sub-pages)
  const hiddenPrefixes = ['/movies', '/photos', '/video-cuts', '/videos'];
  const isHidden = location.pathname === '/' || hiddenPrefixes.some(prefix => location.pathname.startsWith(prefix));
  if (isHidden) return null;

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'MOVIES', path: '/movies' },
    { label: 'BIOGRAPHY', path: '/biography' },
    { label: 'PHOTOS', path: '/photos' },
    { label: 'VIDEO CUTS', path: '/video-cuts' },
    { label: 'VIDEOS', path: '/videos' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-dark/90 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <TigerLogo width={32} height={32} />
            <div className="hidden sm:block">
              <p
                className="text-gold font-bold text-sm tracking-wider"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                NTR
              </p>
              <p className="text-[10px] text-gray-400 tracking-wider">FILMOGRAPHY</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="text-gray-300 hover:text-gold transition-colors duration-300 font-semibold text-xs tracking-wider"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-gold block"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-gold block"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-gold block"
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-charcoal border-t border-gold/20"
          >
            <div className="flex flex-col gap-4 p-4">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className="text-gold hover:text-golden font-semibold transition-colors text-sm tracking-wider"
                  style={{ fontFamily: "'Cinzel', serif" }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
