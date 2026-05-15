import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 border-4 border-gold border-t-golden rounded-full"
    />
  </div>
);

export const PlaceholderCard = ({ title, image, type = 'movie' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    className="relative overflow-hidden rounded-lg group cursor-pointer"
  >
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
    <div className="overlay-dark group-hover:bg-black/60 transition-all duration-300" />
    <div className="absolute inset-0 flex items-end p-4">
      <p className="text-gold font-bold text-lg text-shadow-lg">{title}</p>
    </div>
  </motion.div>
);

export const ToastNotification = ({ message, type = 'info', onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`fixed top-4 right-4 px-6 py-3 rounded-lg font-semibold z-50 ${
      type === 'success' ? 'bg-green-600' :
      type === 'error' ? 'bg-red-600' :
      type === 'warning' ? 'bg-yellow-600' :
      'bg-blue-600'
    }`}
  >
    {message}
  </motion.div>
);

export const ErrorBoundary = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center min-h-screen bg-dark"
  >
    <div className="text-center">
      <h2 className="heading-lg mb-4">⚠️ Error Occurred</h2>
      <p className="text-gray-300 mb-8 max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="btn-primary"
      >
        Try Again
      </button>
    </div>
  </motion.div>
);

export const VideoPlayer = ({ url, thumbnail }) => (
  <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
    <iframe
      src={url}
      title="Video Player"
      allowFullScreen
      className="w-full h-full"
    />
  </div>
);

export const AudioPlayer = ({ title, duration, url, plays }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="card-gold p-4 mb-4"
  >
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <h4 className="text-gold font-bold">{title}</h4>
        <p className="text-sm text-gray-300">{plays.toLocaleString()} plays</p>
      </div>
      <audio controls className="flex-1" controlsList="nodownload">
        <source src={url} type="audio/mpeg" />
      </audio>
    </div>
  </motion.div>
);

export const EmptyState = ({ title, description, actionText, onAction }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16"
  >
    <p className="text-5xl mb-4">📭</p>
    <h3 className="heading-md mb-2">{title}</h3>
    <p className="text-gray-400 mb-6">{description}</p>
    {actionText && (
      <button onClick={onAction} className="btn-primary">
        {actionText}
      </button>
    )}
  </motion.div>
);
