/**
 * VideoFoldersListPage — shows the folder grid for a given video type.
 * Used by: VideoSongsPage, MovieCutsPage, EventsPage, CelebrationsPage
 *
 * Props:
 *   videoType  : 'song' | 'cut' | 'event' | 'celebration'
 *   title      : e.g. 'VIDEO SONGS'
 *   subtitle   : e.g. 'Select a movie to browse its video songs'
 *   backPath   : e.g. '/video-cuts'
 *   folderBasePath : e.g. '/video-cuts/video-songs'
 *   accentColor: CSS color string (optional, defaults to amber)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { videosApi } from '../services/api';
import { getR2Url } from '../config/links';
import ntrBg from '../assets/NTR.jpg';
import { getFolderThumbnail } from '../utils/banners';
import { LoadingSpinner, EmptyState } from '../components/Common';

const FolderCard = ({ folder, onClick, index }) => {
  const [imgError, setImgError] = React.useState(false);
  const showPlaceholder = imgError || !folder.thumbnail_url || folder.thumbnail_url === 'null';

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.97 }}
      className="group text-left focus:outline-none"
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg shadow-black/50 aspect-[3/4] border border-blue-500/20 group-hover:border-blue-400/50 transition-colors">
        {!showPlaceholder ? (
          <img
            src={getFolderThumbnail(folder.name)}
            alt={folder.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e3a8a]/20 to-black/80">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.4-2.2 1.5-2.5l13.5-4c1.1-.3 2.2.4 2.5 1.5l.1.3z"/><path d="m2.6 10.6 17.5 5.8c.8.3 1.2 1.1 1 1.9l-1.3 3.8c-.3.8-1.1 1.2-1.9 1l-17.5-5.8c-.8-.3-1.2-1.1-1-1.9l1.3-3.8c.3-.8 1.1-1.2 1.9-1z"/><path d="m20.8 15.5-2.7-.9"/><path d="m16.8 14.1-2.7-.9"/><path d="m12.9 12.8-2.7-.9"/><path d="m9 11.5-2.7-.9"/>
              </svg>
            </div>
          </div>
        )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />
      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-bold text-xs md:text-sm leading-tight line-clamp-2 drop-shadow" style={{ fontFamily: "'Cinzel', serif" }}>
          {folder.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400 shrink-0">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span className="text-amber-400/80 text-[11px]">{folder.count} clip{folder.count !== 1 ? 's' : ''}</span>
        </div>
      </div>
      {/* Hover arrow */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-7 h-7 bg-amber-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </motion.button>
  );
};

export const VideoFoldersListPage = ({ videoType, title, subtitle, backPath, folderBasePath }) => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    videosApi.getFolders(videoType)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setFolders(data);
      })
      .catch((err) => {
        console.error('Error fetching video folders:', err);
        setError('Failed to load folders. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [videoType]);

  const handleFolderClick = (folder) => {
    // Navigate to the folder detail page using the folder name
    navigate(`${folderBasePath}/${encodeURIComponent(folder.name)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${ntrBg})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark" />

      <div className="relative z-10 min-h-screen">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-4 md:px-8 pt-6 pb-4 md:pt-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate(backPath);
              }
            }}
            className="text-gray-400 hover:text-amber-400 transition-colors shrink-0"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
              {title}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 pb-16">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-red-400 text-sm">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-amber-400/20 text-amber-400 rounded-lg text-sm hover:bg-amber-400/30 transition-colors">
                Retry
              </button>
            </div>
          ) : folders.length > 0 ? (
            <>
              <p className="text-gray-500 text-xs mb-5">{folders.length} folder{folders.length !== 1 ? 's' : ''} available</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {folders.map((folder, i) => (
                  <FolderCard
                    key={folder.slug || folder.name}
                    folder={folder}
                    index={i}
                    onClick={() => handleFolderClick(folder)}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="No Folders Found"
              description={`No ${title.toLowerCase()} available yet. Content coming soon!`}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
