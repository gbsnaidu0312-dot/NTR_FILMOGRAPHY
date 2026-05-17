import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { videosApi } from '../services/api';
import { getR2Url } from '../config/links';
import { VideoGridPlayer } from '../components/VideoGridPlayer';
import { ErrorBoundary } from '../components/Common';

export const VideoFolderDetailPage = ({ videoType, backPath, titlePrefix }) => {
  const { folderName } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodedFolderName = decodeURIComponent(folderName);

  useEffect(() => {
    setLoading(true);
    videosApi.getVideosByFolder(videoType, decodedFolderName)
      .then((res) => {
        setVideos(res.data);
      })
      .catch((err) => {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos.');
      })
      .finally(() => setLoading(false));
  }, [videoType, decodedFolderName]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${getR2Url('/wp5283563.jpg')})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-4 md:px-8 pt-6 pb-4 md:pt-8 shrink-0">
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
            <h1 className="text-xl md:text-2xl font-bold text-amber-400 tracking-wide line-clamp-1" style={{ fontFamily: "'Cinzel', serif" }}>
              {decodedFolderName}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5 uppercase tracking-wider">{titlePrefix}</p>
          </motion.div>
        </div>

        {/* Content */}
        {error ? (
          <ErrorBoundary message={error} onRetry={() => window.location.reload()} />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <VideoGridPlayer videos={videos} loading={loading} folderName={decodedFolderName} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
