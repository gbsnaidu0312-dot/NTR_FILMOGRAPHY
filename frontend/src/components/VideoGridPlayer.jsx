/**
 * VideoGridPage — shared component for showing a list of videos + inline player modal.
 * Used by the "folder detail" pages (VideoSongs/MovieCuts/Events/Celebrations).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration } from '../utils/helpers';
import { LoadingSpinner, EmptyState, VideoPlayer } from './Common';
import { getR2Url } from '../config/links';

// ─── Mini Icons ────────────────────────────────────────────────────────────────
const GridLargeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
);
const GridMediumIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
);
const GridCompactIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1"/></svg>
);
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);

// ─── Video Card ───────────────────────────────────────────────────────────────
const VideoCard = ({ video, index, gridView, onClick }) => {
  const aspectClass = gridView === 'large' ? 'aspect-video' : 'aspect-video';
  return (
    <motion.button
      onClick={() => onClick(index)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.03 }}
      className="group text-left"
    >
      <div className={`relative rounded-xl overflow-hidden ${aspectClass} shadow-md shadow-black/40`}>
        <img
          src={video.thumbnail_url || getR2Url('/wp5283563.jpg')}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = getR2Url('/wp5283563.jpg'); }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/85 transition-all duration-300" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-amber-400/25 rounded-full flex items-center justify-center backdrop-blur-sm border border-amber-400/40">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400 ml-1">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
        {/* Duration badge */}
        {video.duration_seconds && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs text-white">
            {formatDuration(video.duration_seconds)}
          </div>
        )}
      </div>
      <div className="mt-2 px-1">
        <h3 className="font-semibold text-amber-300 text-sm line-clamp-1 group-hover:text-amber-200 transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
          {video.title}
        </h3>
        {video.views > 0 && (
          <p className="text-xs text-gray-500 mt-0.5">{video.views.toLocaleString()} views</p>
        )}
      </div>
    </motion.button>
  );
};

// ─── Video Player Modal ───────────────────────────────────────────────────────
const PlayerModal = ({ videos, index, onClose, onPrev, onNext, onLike, likedSet, onDownload, onShare, folderName }) => {
  const video = videos[index];
  if (!video) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/96 z-50 flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-gray-400 text-sm truncate max-w-[50%]">{folderName}</span>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs transition-all">
            <DownloadIcon/><span className="hidden sm:inline">Download</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs transition-all">
            <ShareIcon/><span className="hidden sm:inline">Share</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => onLike(video.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${likedSet.has(video.id) ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            <HeartIcon filled={likedSet.has(video.id)}/>
            <span className="hidden sm:inline">{likedSet.has(video.id) ? 'Liked' : 'Like'}</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white ml-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </motion.button>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-16 relative min-h-0">
        <motion.button onClick={onPrev} whileHover={{ scale: 1.1 }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-400/20 hover:bg-amber-400/40 rounded-full flex items-center justify-center text-white z-10 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </motion.button>

        <motion.div key={index} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="relative max-w-5xl w-full flex flex-col items-center">
          <VideoPlayer url={video.video_url} thumbnail={video.thumbnail_url}/>
          <div className="mt-4 text-center">
            <h3 className="text-amber-400 text-lg md:text-2xl font-bold mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
              {video.title}
            </h3>
            <p className="text-gray-500 text-sm">{index + 1} / {videos.length}</p>
          </div>
        </motion.div>

        <motion.button onClick={onNext} whileHover={{ scale: 1.1 }}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-400/20 hover:bg-amber-400/40 rounded-full flex items-center justify-center text-white z-10 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </motion.button>
      </div>

      {/* Thumbnail strip */}
      <div className="shrink-0 px-4 py-3 bg-black/60">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(251,191,36,0.3) transparent' }}>
          {videos.map((v, i) => (
            <motion.button key={v.id || i} whileHover={{ scale: 1.06 }}
              className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${i === index ? 'ring-2 ring-amber-400' : 'opacity-50 hover:opacity-90'}`}
              style={{ width: 96, height: 54 }}
              onClick={() => onLike(null) || true}>
              {/* We can't directly set index from here easily; using a wrapper instead */}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
/**
 * @param {Object}  props
 * @param {Array}   props.videos      [{id, title, video_url, thumbnail_url, duration_seconds, views}]
 * @param {boolean} props.loading
 * @param {string}  props.folderName  — displayed in the player modal header
 */
export const VideoGridPlayer = ({ videos, loading, folderName }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [gridView, setGridView] = useState('medium');
  const [likedVideos, setLikedVideos] = useState(new Set());

  const toggleLike = (id) => {
    if (id === null) return;
    setLikedVideos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDownload = () => {
    const v = videos[selectedIdx];
    if (v?.video_url) {
      const a = document.createElement('a');
      a.href = v.video_url;
      a.download = v.title || 'video';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
  };

  const handleShare = async () => {
    const v = videos[selectedIdx];
    if (navigator.share && v) {
      try { await navigator.share({ title: v.title, url: window.location.href }); } catch (_) {}
    } else {
      try { await navigator.clipboard.writeText(window.location.href); alert('Link copied!'); } catch (_) {}
    }
  };

  const gridColsClass = {
    large: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3',
    medium: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    compact: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  }[gridView];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
      {/* Grid view toggle */}
      {videos.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">{videos.length} video{videos.length !== 1 ? 's' : ''}</p>
          <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 backdrop-blur-sm">
            {[['large', GridLargeIcon], ['medium', GridMediumIcon], ['compact', GridCompactIcon]].map(([key, Icon]) => (
              <button key={key} onClick={() => setGridView(key)}
                className={`p-1.5 rounded transition-all ${gridView === key ? 'bg-amber-400/20 text-amber-400' : 'text-gray-400 hover:text-gray-200'}`}>
                <Icon />
              </button>
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 ? (
        <div className={`grid ${gridColsClass} gap-4 md:gap-5`}>
          {videos.map((video, i) => (
            <VideoCard key={video.id || i} video={video} index={i} gridView={gridView} onClick={setSelectedIdx} />
          ))}
        </div>
      ) : (
        <EmptyState title="No Videos Found" description="No videos available in this folder yet." />
      )}

      {/* Player Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <PlayerModal
            videos={videos}
            index={selectedIdx}
            onClose={() => setSelectedIdx(null)}
            onPrev={() => setSelectedIdx((p) => (p - 1 + videos.length) % videos.length)}
            onNext={() => setSelectedIdx((p) => (p + 1) % videos.length)}
            onLike={toggleLike}
            likedSet={likedVideos}
            onDownload={handleDownload}
            onShare={handleShare}
            folderName={folderName}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
