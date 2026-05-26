import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { moviesApi } from '../services/api';
import { formatDuration } from '../utils/helpers';
import { LoadingSpinner, ErrorBoundary } from '../components/Common';
import { getR2Url } from '../config/links';
import { getLandscapeBanner, getPortraitBanner } from '../utils/banners';
import { downloadFile } from '../utils/download';

export const MoviesPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [audioSongs, setAudioSongs] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [playMovie, setPlayMovie] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  // Sidebar resize handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = Math.max(100, Math.min(320, e.clientX));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesApi.getAll();
      if (response.data.results && response.data.results.length > 0) {
        setMovies(response.data.results);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch audio songs when movie changes
  useEffect(() => {
    if (movies.length > 0) {
      fetchAudioSongs(movies[selectedIndex].slug);
    }
  }, [selectedIndex, movies]);

  const fetchAudioSongs = async (slug) => {
    try {
      const response = await moviesApi.getAudioSongs(slug);
      const songs = response.data.results || response.data || [];
      if (songs.length > 0) {
        setAudioSongs(songs);
        setCurrentSong(null);
      }
    } catch (err) {
      console.error('Error fetching audio songs:', err);
      setAudioSongs([]);
    }
  };

  const selectedMovie = movies[selectedIndex] || null;

  const handlePlaySong = (song) => {
    if (currentSong?.id === song.id) {
      setCurrentSong(null);
    } else {
      setCurrentSong(song);
    }
  };

  const handleDownload = () => {
    if (!selectedMovie?.movie_url) return;
    const ext = selectedMovie.movie_url.split('.').pop().split('?')[0] || 'mkv';
    downloadFile(selectedMovie.movie_url, `${selectedMovie.title}.${ext}`);
  };

  const handleShare = async () => {
    if (!selectedMovie?.movie_url) return;
    try {
      await navigator.clipboard.writeText(selectedMovie.movie_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && movies.length === 0) {
    return <ErrorBoundary message={error} onRetry={fetchMovies} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark flex"
    >
      {/* ── MOBILE: Floating compact pill sidebar ── */}
      {isMobile && (
        <div className="fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-black/80 backdrop-blur-md rounded-2xl py-3 px-1.5 border border-white/10 shadow-2xl overflow-y-auto scrollbar-hide max-h-[80vh]">
          {movies.map((movie, i) => (
            <button
              key={movie.id}
              onClick={() => setSelectedIndex(i)}
              className="relative flex flex-col items-center group"
            >
              {/* Active indicator bar */}
              {i === selectedIndex && (
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-400 rounded-full" />
              )}
              <div
                className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  i === selectedIndex
                    ? 'border-amber-400 shadow-lg shadow-amber-400/40 scale-110'
                    : 'border-white/10 opacity-50 hover:opacity-80 hover:border-white/30'
                }`}
              >
                <img
                  src={getPortraitBanner(movie)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── DESKTOP: Filmstrip Sidebar - Resizable ── */}
      {!isMobile && (
      <div
        ref={sidebarRef}
        className="fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-black/95 border-r border-gold/10 overflow-y-auto scrollbar-hide"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Resize Handle */}
        <div
          onMouseDown={() => setIsResizing(true)}
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-40 hover:bg-gold/30 transition-colors"
        />
        {/* Sprocket holes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(212,175,55,0.1) 3px, transparent 3px)`,
            backgroundSize: '16px 32px',
            backgroundPosition: '8px 12px',
          }}
        />

        {/* Movie thumbnails */}
        <div className="relative z-10 flex flex-col items-center py-5 gap-5">
          {movies.map((movie, i) => (
            <button
              key={movie.id}
              onClick={() => setSelectedIndex(i)}
              className={`relative flex flex-col items-center transition-all duration-300 ${i === selectedIndex ? 'scale-105' : 'opacity-50 hover:opacity-80'
                }`}
            >
              <span
                className={`text-[10px] md:text-xs font-bold mb-2 text-center px-1 truncate max-w-full ${i === selectedIndex ? 'text-gold' : 'text-gray-600'
                  }`}
                style={{ fontFamily: "'Cinzel', serif", maxWidth: `${Math.max(80, sidebarWidth * 0.65)}px` }}
                title={movie.title}
              >
                {movie.title}
              </span>
              <div
                className="rounded-lg overflow-hidden border-2 transition-all duration-300"
                style={{
                  width: `${Math.max(80, sidebarWidth * 0.65)}px`,
                  height: `${Math.max(110, sidebarWidth * 0.9)}px`,
                  borderColor: i === selectedIndex ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.15)',
                  boxShadow: i === selectedIndex ? '0 0 20px rgba(212,175,55,0.35)' : 'none',
                }}
              >
                <img
                  src={getPortraitBanner(movie)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
      )} {/* end desktop sidebar */}

      {/* Main Content */}
      <div
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{ marginLeft: isMobile ? 0 : `${sidebarWidth}px` }}
      >
        <AnimatePresence mode="wait">
          {selectedMovie && (
            <motion.div
              key={selectedMovie.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section — fills viewport */}
              <div className="relative min-h-screen flex">
                {/* Back Button - Absolute Positioned */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => navigate('/')}
                  className="absolute top-6 left-6 md:left-12 z-20 text-gray-400 hover:text-gold transition-colors flex items-center gap-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm">Back</span>
                </motion.button>

                {/* Left: Movie Info */}
                <div className="relative z-10 flex flex-col justify-center pl-20 pr-6 py-6 md:p-12 w-full md:w-[40%] lg:w-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1
                      className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-2"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                      }}
                    >
                      {selectedMovie.title}
                    </h1>
                    {selectedMovie.title === 'Devara' && (
                      <p className="text-gray-400 text-sm mb-3">(Part 1)</p>
                    )}
                    <p className="text-gray-400 text-sm md:text-base mb-4">
                      {selectedMovie.release_year} • {selectedMovie.duration_minutes}m • {selectedMovie.genre} / Drama
                    </p>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-md mb-8">
                      {selectedMovie.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          if (selectedMovie?.movie_url) {
                            setPlayMovie(selectedMovie);
                          }
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-md transition-colors ${selectedMovie?.movie_url
                          ? 'bg-gray-200 text-dark hover:bg-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        PLAY
                      </button>
                      <button
                        onClick={handleDownload}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md border transition-colors ${selectedMovie?.movie_url
                          ? 'border-gray-500 text-gray-300 hover:border-gray-300 hover:text-white'
                          : 'border-gray-700 text-gray-600 cursor-not-allowed'
                          }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        DOWNLOAD
                      </button>
                      <button
                        onClick={handleShare}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md border transition-colors relative ${selectedMovie?.movie_url
                          ? 'border-gray-500 text-gray-300 hover:border-gray-300 hover:text-white'
                          : 'border-gray-700 text-gray-600 cursor-not-allowed'
                          }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        {copied ? 'COPIED' : 'SHARE'}
                        {/* Copied toast */}
                        <AnimatePresence>
                          {copied && (
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold text-dark text-xs font-bold px-3 py-1 rounded whitespace-nowrap"
                            >
                              Link copied!
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>

                    </div>
                  </motion.div>
                </div>

                {/* Right: Movie Image */}
                <div className="absolute md:relative right-0 top-0 bottom-0 w-full md:w-[60%] lg:w-2/3">
                  <div
                    className="absolute inset-0 bg-cover bg-right"
                    style={{ backgroundImage: `url('${getLandscapeBanner(selectedMovie)}')` }}
                  />
                  {/* Mobile full fade for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent md:hidden" />
                  {/* Desktop ultra-sharp seam fade */}
                  <div className="hidden md:block absolute left-0 top-0 bottom-0 w-20 lg:w-30 bg-gradient-to-r from-dark to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                </div>
              </div>

              {/* Audio Songs Accordion */}
              <div className="px-6 md:px-12 py-8">
                <button
                  onClick={() => setAudioOpen(!audioOpen)}
                  className="w-full flex items-center justify-between text-gold text-sm font-bold tracking-wider mb-2 border-b border-gold/20 pb-2 hover:text-golden transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <span>AUDIO SONGS</span>
                  <motion.span
                    animate={{ rotate: audioOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence>
                  {audioOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pt-4">
                        {audioSongs.map((song, i) => {
                          const isCurrentSong = currentSong?.id === song.id;
                          return (
                            <motion.div
                              key={song.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              onClick={() => handlePlaySong(song)}
                              className={`group flex items-center gap-4 py-3 px-3 rounded-lg cursor-pointer transition-all duration-300 ${isCurrentSong
                                ? 'bg-gold/10'
                                : 'hover:bg-white/5'
                                }`}
                            >
                              {/* Song Thumbnail */}
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={getPortraitBanner(selectedMovie)}
                                  alt={song.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Song Info */}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-semibold text-sm md:text-base truncate ${isCurrentSong ? 'text-gold' : 'text-gray-200 group-hover:text-gold'
                                    }`}
                                >
                                  {song.title}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                              </div>

                              {/* Duration */}
                              <span className="text-xs text-gray-500 hidden md:block">
                                {formatDuration(song.duration_seconds)}
                              </span>

                              {/* Play Button */}
                              <button
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCurrentSong
                                  ? 'bg-gold text-dark'
                                  : 'bg-gray-700 text-gray-300 group-hover:bg-gold group-hover:text-dark'
                                  }`}
                              >
                                {isCurrentSong ? (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                  </svg>
                                ) : (
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                  </svg>
                                )}
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Player — inline below playlist */}
                      <AnimatePresence>
                        {currentSong && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 bg-[#0d0d0d] border border-gold/10 rounded-xl px-4 md:px-6 py-4"
                          >
                            <div className="flex items-center gap-4">
                              {/* Current Song Info */}
                              <div className="flex items-center gap-3 w-[180px] md:w-[240px] flex-shrink-0">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded overflow-hidden">
                                  <img
                                    src={getPortraitBanner(selectedMovie)}
                                    alt={currentSong.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-gold text-sm font-semibold truncate">
                                    {currentSong.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 truncate">
                                    {selectedMovie?.title}
                                  </p>
                                </div>
                              </div>

                              {/* Audio Element */}
                              <div className="flex-1">
                                <audio
                                  controls
                                  autoPlay
                                  className="w-full"
                                  controlsList="nodownload"
                                  src={currentSong.audio_url}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Movie Player Modal */}
        <AnimatePresence>
          {playMovie && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <h3 className="text-gold font-bold text-lg" style={{ fontFamily: "'Cinzel', serif" }}>
                  {playMovie.title}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPlayMovie(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>

              {/* Video Player */}
              <div className="flex-1 flex items-center justify-center px-4 md:px-12 pb-8">
                <motion.div
                  key={playMovie.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-6xl"
                >
                  <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <video
                      key={playMovie.movie_url}
                      className="w-full h-full"
                      controls
                      autoPlay
                      playsInline
                    >
                      <source src={playMovie.movie_url} />
                    </video>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
