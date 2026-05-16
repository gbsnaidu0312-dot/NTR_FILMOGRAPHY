/**
 * VideoFolderBrowser — shared component used by all four video category pages.
 * Shows:
 *   1. A grid of movie/event folders
 *   2. On folder click  → navigate to /video-cuts/video-songs/:slug etc.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getR2Url } from '../config/links';
import { EmptyState, LoadingSpinner } from './Common';

const FolderCard = ({ folder, onClick }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.04, y: -4 }}
    whileTap={{ scale: 0.97 }}
    className="group text-left"
  >
    <div className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-lg shadow-black/40">
      <img
        src={folder.thumbnail_url || getR2Url('/wp5283563.jpg')}
        alt={folder.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => { e.target.src = getR2Url('/wp5283563.jpg'); }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow" style={{ fontFamily: "'Cinzel', serif" }}>
          {folder.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span className="text-amber-400/90 text-xs">{folder.count} video{folder.count !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  </motion.button>
);

/**
 * @param {Object} props
 * @param {Array}  props.folders      — [{name, slug, count, thumbnail_url}]
 * @param {boolean} props.loading
 * @param {string}  props.title       — e.g. "VIDEO SONGS"
 * @param {Function} props.onFolderClick — receives the folder object
 * @param {string}  props.emptyText
 */
export const VideoFolderGrid = ({ folders, loading, title, onFolderClick, emptyText }) => {
  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-12"
    >
      {folders.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {folders.map((folder) => (
            <FolderCard
              key={folder.slug || folder.name}
              folder={folder}
              onClick={() => onFolderClick(folder)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Folders Found"
          description={emptyText || `No ${title} folders available yet`}
        />
      )}
    </motion.div>
  );
};
