import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { photosApi } from '../services/api';
import { handleApiError } from '../utils/helpers';
import { LoadingSpinner, ErrorBoundary, EmptyState } from '../components/Common';
import { FilmReelIcon, CalendarStarIcon, FolderIcon, CameraIcon } from '../assets/icons';
import { getR2Url } from '../config/links';
import { getFolderThumbnail } from '../utils/banners';

// Grid view icons
const GridLargeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);

const GridMediumIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1" />
    <rect x="13" y="3" width="8" height="8" rx="1" />
    <rect x="3" y="13" width="8" height="8" rx="1" />
    <rect x="13" y="13" width="8" height="8" rx="1" />
  </svg>
);

const GridCompactIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="4" height="4" rx="1" />
    <rect x="10" y="3" width="4" height="4" rx="1" />
    <rect x="17" y="3" width="4" height="4" rx="1" />
    <rect x="3" y="10" width="4" height="4" rx="1" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
    <rect x="17" y="10" width="4" height="4" rx="1" />
    <rect x="3" y="17" width="4" height="4" rx="1" />
    <rect x="10" y="17" width="4" height="4" rx="1" />
    <rect x="17" y="17" width="4" height="4" rx="1" />
  </svg>
);

// Action icons
const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PhotoFolderCard = ({ folder, index, onClick }) => {
  const [imgError, setImgError] = React.useState(false);
  const thumbnailSrc = getFolderThumbnail(folder.name);
  const showPlaceholder = imgError || !thumbnailSrc;

  return (
    <motion.button
      onClick={() => onClick(folder)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      className="text-left group"
    >
      <div className="relative rounded-lg overflow-hidden mb-3 aspect-square border border-blue-500/20 group-hover:border-blue-400/50 transition-colors">
        {!showPlaceholder ? (
          <img
            src={thumbnailSrc}
            alt={folder.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e3a8a]/20 to-black/80">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg">{folder.photo_count}</span>
          <span className="text-gray-300 text-xs">photos</span>
        </div>
      </div>
      <h3 className="font-bold text-gold group-hover:text-golden transition-colors text-sm md:text-base">
        {folder.name}
      </h3>
      <p className="text-xs text-gray-400">{folder.description}</p>
    </motion.button>
  );
};

export const PhotosPage = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [activeType, setActiveType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [gridView, setGridView] = useState('medium'); // 'large', 'medium', 'compact'
  const [likedPhotos, setLikedPhotos] = useState(new Set());

  useEffect(() => {
    if (activeType) {
      fetchFolders();
    } else {
      setFolders([]);
      setLoading(false);
    }
  }, [activeType]);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await photosApi.getFolders(activeType);
      if (response.data.results && response.data.results.length > 0) {
        setFolders(response.data.results);
      }
      setSelectedFolder(null);
      setPhotos([]);
      setSelectedPhotoIndex(null);
      setError(null);
    } catch (err) {
      console.error('Error fetching folders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotosForFolder = async (folder) => {
    try {
      setLoading(true);
      const response = await photosApi.getFolderBySlug(folder.slug);
      if (response.data.photos && response.data.photos.length > 0) {
        setPhotos(response.data.photos);
      }
      setSelectedFolder(folder);
      setSelectedPhotoIndex(null);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setSelectedFolder(folder);
      setSelectedPhotoIndex(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder) => {
    fetchPhotosForFolder(folder);
  };

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
  };

  const handlePreviousPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handleBack = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(null);
    } else if (selectedFolder) {
      setSelectedFolder(null);
      setPhotos([]);
    } else if (activeType) {
      setActiveType(null);
    } else {
      navigate('/');
    }
  };

  const toggleLike = (photoId) => {
    setLikedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  };

  const handleDownload = () => {
    const photo = photos[selectedPhotoIndex];
    if (photo?.image_url) {
      const link = document.createElement('a');
      link.href = photo.image_url;
      link.download = photo.caption || 'photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    const photo = photos[selectedPhotoIndex];
    if (navigator.share && photo) {
      try {
        await navigator.share({
          title: photo.caption,
          text: `Check out this photo: ${photo.caption}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy');
      }
    }
  };

  const getGridClasses = () => {
    switch (gridView) {
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 'medium':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 'compact':
        return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  const categories = [
    {
      id: 'movie',
      title: 'MOVIES',
      label: '30 FOLDERS',
      icon: <FilmReelIcon />,
      cardClass: 'hero-card-gold',
      iconColor: 'text-amber-400',
    },
    {
      id: 'event',
      title: 'EVENTS',
      label: 'MULTIPLE FOLDERS',
      icon: <CalendarStarIcon />,
      cardClass: 'hero-card-red',
      iconColor: 'text-red-400',
    },
    {
      id: 'offline',
      title: 'OFFLINE',
      label: 'PRIVATE COLLECTION',
      icon: <FolderIcon />,
      cardClass: 'hero-card-blue',
      iconColor: 'text-blue-400',
    },
  ];

  const currentPhoto = photos[selectedPhotoIndex];

  if (loading && folders.length === 0 && activeType) return <LoadingSpinner />;
  if (error && folders.length === 0) {
    return <ErrorBoundary message={error} onRetry={fetchFolders} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${getR2Url('/wp5283563.jpg')})` }}
      />
      <div className="absolute inset-0 bg-dark/85" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 md:px-8 pt-6 md:pt-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="text-gray-400 hover:text-gold transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Grid View Toggle - only show when photo grid is visible */}
          {selectedFolder && photos.length > 0 && selectedPhotoIndex === null && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 bg-black/40 rounded-lg p-1.5 backdrop-blur-sm"
            >
              <button
                onClick={() => setGridView('large')}
                className={`p-2 rounded transition-all ${gridView === 'large' ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:text-gray-200'}`}
                title="Large Grid"
              >
                <GridLargeIcon />
              </button>
              <button
                onClick={() => setGridView('medium')}
                className={`p-2 rounded transition-all ${gridView === 'medium' ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:text-gray-200'}`}
                title="Medium Grid"
              >
                <GridMediumIcon />
              </button>
              <button
                onClick={() => setGridView('compact')}
                className={`p-2 rounded transition-all ${gridView === 'compact' ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:text-gray-200'}`}
                title="Compact Grid"
              >
                <GridCompactIcon />
              </button>
            </motion.div>
          )}

          {/* Search icon when no grid view */}
          {!selectedFolder && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-400 hover:text-gold transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </motion.button>
          )}
        </div>

        {/* Enhanced Photo Lightbox Modal */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && currentPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            >
              {/* Top Action Bar */}
              <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">
                    {selectedFolder?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs md:text-sm transition-all"
                  >
                    <DownloadIcon />
                    <span className="hidden sm:inline">Download</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs md:text-sm transition-all"
                  >
                    <ShareIcon />
                    <span className="hidden sm:inline">Share</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => currentPhoto && toggleLike(currentPhoto.id)}
                    className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm transition-all ${
                      currentPhoto && likedPhotos.has(currentPhoto.id)
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <HeartIcon filled={currentPhoto && likedPhotos.has(currentPhoto.id)} />
                    <span className="hidden sm:inline">
                      {currentPhoto && likedPhotos.has(currentPhoto.id) ? 'Liked' : 'Like'}
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseLightbox}
                    className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white text-lg md:text-xl ml-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Main Image Area */}
              <div className="flex-1 flex items-center justify-center px-4 md:px-20 relative">
                <motion.button
                  onClick={handlePreviousPhoto}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-gold/20 hover:bg-gold/40 rounded-full flex items-center justify-center text-white text-xl md:text-2xl transition-all z-10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </motion.button>

                <motion.div
                  key={selectedPhotoIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-w-5xl w-full flex flex-col items-center"
                >
                  <img
                    src={currentPhoto?.image_url}
                    alt={currentPhoto?.caption}
                    className="w-full h-auto rounded-lg max-h-[60vh] object-contain"
                  />

                  {/* Caption and Counter */}
                  <div className="mt-4 md:mt-6 text-center">
                    <h3 className="text-gold text-lg md:text-2xl font-bold mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                      {currentPhoto?.caption}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {selectedPhotoIndex + 1} / {photos.length}
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  onClick={handleNextPhoto}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-gold/20 hover:bg-gold/40 rounded-full flex items-center justify-center text-white text-xl md:text-2xl transition-all z-10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </motion.button>
              </div>

              {/* Thumbnail Strip */}
              <div className="px-4 md:px-8 py-3 md:py-4 bg-black/60">
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
                  {photos.map((photo, i) => (
                    <motion.button
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(i)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex-shrink-0 rounded-md overflow-hidden transition-all ${
                        i === selectedPhotoIndex
                          ? 'ring-2 ring-gold'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      style={{ width: 64, height: 44 }}
                    >
                      <img
                        src={photo.thumbnail_url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center px-4 md:px-8 pt-4 pb-8">
          {!activeType ? (
            /* Category Selection View */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-4xl flex flex-col items-center"
            >
              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-10 md:mb-14"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <CameraIcon width={32} height={32} />
                  <h1
                    className="text-3xl md:text-4xl font-bold text-gold tracking-wider"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    PHOTOS
                  </h1>
                </div>
                <p className="text-gray-500 text-sm tracking-wide">
                  Explore Images from Movies, Events & Offline
                </p>
              </motion.div>

              {/* Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
                {categories.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveType(cat.id)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <div
                      className={`${cat.cardClass} rounded-xl p-8 md:p-10 backdrop-blur-sm transition-all duration-500 flex flex-col items-center`}
                    >
                      <div className={`${cat.iconColor} mb-5`}>
                        {cat.icon}
                      </div>
                      <h3
                        className="text-gold font-bold text-lg md:text-xl tracking-wider mb-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {cat.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {cat.label}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Quote + NTR Image Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 mt-auto"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gold text-2xl">&ldquo;</span>
                  <div>
                    <p
                      className="text-gold text-base md:text-lg"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Memories Captured. Moments Cherished.
                    </p>
                    <p
                      className="text-gold/60 text-sm mt-1"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Jr. NTR
                    </p>
                  </div>
                </div>
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden">
                  <img
                    src={getR2Url('/wp5283563.jpg')}
                    alt="NTR"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Folder & Photo Grid View */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-6xl"
            >
              <h2
                className="text-gold text-2xl md:text-3xl font-bold text-center mb-8"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {categories.find((c) => c.id === activeType)?.title} GALLERY
              </h2>

              {!selectedFolder ? (
                /* Folder Grid */
                folders.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.08 }}
                  >
                    {folders.map((folder, i) => (
                      <PhotoFolderCard
                        key={i}
                        index={i}
                        folder={folder}
                        onClick={handleFolderClick}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    title="No Folders Found"
                    description={`No ${activeType} folders available yet`}
                  />
                )
              ) : (
                /* Photo Grid for Selected Folder */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gold text-xl font-bold">{selectedFolder.name}</h3>
                    <span className="text-gray-400 text-sm">{photos.length} photos</span>
                  </div>
                  <div className={`grid ${getGridClasses()} gap-3 md:gap-4`}>
                    {photos.map((photo, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handlePhotoClick(i)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ scale: 1.03 }}
                        className="group relative overflow-hidden rounded-lg aspect-square"
                      >
                        <img
                          src={photo.thumbnail_url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                            View
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
