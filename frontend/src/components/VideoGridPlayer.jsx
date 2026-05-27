/**
 * VideoGridPage — shared component for showing a list of videos + inline player modal.
 * Used by the "folder detail" pages (VideoSongs/MovieCuts/Events/Celebrations).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration } from '../utils/helpers';
import { LoadingSpinner, EmptyState, VideoPlayer } from './Common';
import { getR2Url } from '../config/links';
import { getFolderThumbnail } from '../utils/banners';
import TigerIcon from '../assets/Tigericon.jpg';

// Helper to check if a URL points to a video file
const isVideoLink = (url) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.endsWith('.mp4') || lower.endsWith('.mkv') || lower.endsWith('.webm') || lower.endsWith('.mov');
};

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
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);

// ─── Hover Video Player ────────────────────────────────────────────────────────
const HoverVideoPlayer = ({ videoSrc, posterSrc, durationSeconds, isHovered, onDurationLoaded }) => {
  const videoRef = React.useRef(null);
  const isMp4 = videoSrc && videoSrc.toLowerCase().endsWith('.mp4');

  React.useEffect(() => {
    if (isMp4 && videoRef.current) {
      if (isHovered) {
        videoRef.current.preload = 'auto';
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, isMp4]);

  const startTime = durationSeconds ? Math.min(Math.floor(durationSeconds * 0.2), 10) : 10;

  if (!isMp4) {
    return (
      <img
        src={posterSrc || getR2Url('/wp5283563.jpg')}
        alt="thumbnail"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => { e.target.src = getR2Url('/wp5283563.jpg'); }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={`${videoSrc}#t=${startTime}`}
      muted
      loop
      playsInline
      preload="none"
      poster={posterSrc}
      onLoadedMetadata={(e) => {
        if (e.target.duration && onDurationLoaded) {
          onDurationLoaded(Math.round(e.target.duration));
        }
      }}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
  );
};

// ─── Video Card ───────────────────────────────────────────────────────────────
const VideoCard = ({ video, index, gridView, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [actualDuration, setActualDuration] = useState(video.duration_seconds);
  const aspectClass = gridView === 'large' ? 'aspect-video' : 'aspect-video';

  // Determine the correct visual thumbnail for the video card
  const posterSrc = React.useMemo(() => {
    // If the database has a real image thumbnail (and not a copy of the mp4 URL)
    if (video.thumbnail_url && !isVideoLink(video.thumbnail_url)) {
      return video.thumbnail_url;
    }
    
    // Fallback 1: Use movie_banner if available from the serializer
    if (video.movie_banner) {
      return video.movie_banner;
    }

    // Fallback 2: Use movie_poster if available from the serializer
    if (video.movie_poster) {
      return video.movie_poster;
    }

    // Fallback 3: Try folder-level mapping (covers movies like Aadi, Janatha Garage, etc.)
    if (video.folder_name) {
      return getFolderThumbnail(video.folder_name);
    }

    // Fallback 4: Default premium logo
    return TigerIcon;
  }, [video]);

  return (
    <motion.button
      onClick={() => onClick(index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.03 }}
      className="group text-left"
    >
      <div className={`relative rounded-xl overflow-hidden ${aspectClass} shadow-md shadow-black/40 border border-blue-500/20 group-hover:border-blue-400/50 transition-colors`}>
        <HoverVideoPlayer 
          videoSrc={video.video_url} 
          posterSrc={posterSrc} 
          durationSeconds={actualDuration} 
          isHovered={isHovered}
          onDurationLoaded={setActualDuration}
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
        {actualDuration && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs text-white">
            {formatDuration(actualDuration)}
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
const PlayerModal = ({ videos, index, onClose, onPrev, onNext, onShare, shareCopied, onSelect, folderName }) => {
  const video = videos[index];
  if (!video) return null;

  const bgImage = React.useMemo(() => {
    return (video.thumbnail_url && !isVideoLink(video.thumbnail_url)) ? video.thumbnail_url :
      video.movie_banner ? video.movie_banner :
      video.movie_poster ? video.movie_poster :
      video.folder_name ? getFolderThumbnail(video.folder_name) :
      getR2Url('/tiger-nation-logo-landscape.jpg');
  }, [video]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex flex-col overflow-hidden"
    >
      {/* Dynamic blurred ambient color backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-110 pointer-events-none filter blur-[80px] opacity-35 z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Glassmorphic dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl z-0" />

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 relative z-10">
        <span className="text-gray-400 text-sm truncate max-w-[50%]">{folderName}</span>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} onClick={onShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${shareCopied ? 'bg-amber-400/20 text-amber-400' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            <ShareIcon/><span className="hidden sm:inline">{shareCopied ? 'Copied!' : 'Share'}</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white ml-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </motion.button>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-16 relative min-h-0 z-10">
        <motion.button onClick={onPrev} whileHover={{ scale: 1.1 }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-400/20 hover:bg-amber-400/40 rounded-full flex items-center justify-center text-white z-10 transition-all">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </motion.button>

        <motion.div key={index} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="relative max-w-5xl w-full flex flex-col items-center">
          <VideoPlayer url={video.video_url} thumbnail={
            (video.thumbnail_url && !isVideoLink(video.thumbnail_url)) ? video.thumbnail_url :
            video.movie_banner ? video.movie_banner :
            video.movie_poster ? video.movie_poster :
            video.folder_name ? getFolderThumbnail(video.folder_name) :
            TigerIcon
          }/>
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
      <div className="shrink-0 px-4 py-3 bg-black/60 relative z-10">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(251,191,36,0.3) transparent' }}>
          {videos.map((v, i) => (
            <motion.button key={v.id || i} whileHover={{ scale: 1.06 }}
              className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${i === index ? 'ring-2 ring-amber-400 opacity-100' : 'opacity-40 hover:opacity-90'}`}
              style={{ width: 96, height: 54 }}
              onClick={() => onSelect(i)}>
              <img 
                src={
                  (v.thumbnail_url && !isVideoLink(v.thumbnail_url)) ? v.thumbnail_url :
                  v.movie_banner ? v.movie_banner :
                  v.movie_poster ? v.movie_poster :
                  v.folder_name ? getFolderThumbnail(v.folder_name) :
                  TigerIcon
                } 
                alt={v.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = getR2Url('/wp5283563.jpg'); }}
              />
              {/* Highlight Play Overlay */}
              {i === index && (
                <div className="absolute inset-0 bg-amber-400/25 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-md border border-amber-300">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-0.5">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                </div>
              )}
              {/* Index Badge */}
              <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[9px] font-bold text-amber-400 shadow">
                {i + 1}
              </div>
              {/* Top hover title */}
              <div className="absolute inset-x-0 top-0 bg-black/70 p-1 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <p className="text-[8px] text-white truncate text-center font-medium leading-none">{v.title}</p>
              </div>
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
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (_) {}
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
            onShare={handleShare}
            shareCopied={shareCopied}
            onSelect={setSelectedIdx}
            folderName={folderName}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
