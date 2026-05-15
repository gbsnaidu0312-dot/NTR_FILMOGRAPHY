import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { moviesApi } from '../services/api';
import { formatDuration, handleApiError } from '../utils/helpers';
import { LoadingSpinner, ErrorBoundary, VideoPlayer, EmptyState } from '../components/Common';

export const MovieDetailsPage = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [audioSongs, setAudioSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieData();
  }, [slug]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);

      // Fetch movie details
      const movieRes = await moviesApi.getBySlug(slug);
      setMovie(movieRes.data);

      // Fetch audio songs
      try {
        const audioRes = await moviesApi.getAudioSongs(slug);
        setAudioSongs(audioRes.data || []);
      } catch {
        setAudioSongs([]);
      }

      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !movie) return <ErrorBoundary message={error} onRetry={fetchMovieData} />;

  if (!movie) return <ErrorBoundary message="Movie not found" onRetry={fetchMovieData} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark pt-20"
    >
      {/* Hero Banner */}
      <motion.div
        className="relative w-full aspect-video md:aspect-auto md:h-96 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.banner_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="heading-xl mb-4">{movie.title}</h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-semibold">
                  {movie.release_year}
                </span>
                <span className="px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-semibold">
                  {movie.genre}
                </span>
                <span className="px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-semibold">
                  {movie.duration_minutes} min
                </span>
                <span className="px-4 py-1.5 bg-red/20 text-red rounded-full text-sm font-semibold">
                  {movie.box_office}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="bg-charcoal border-b border-gold/20 px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4">
          <button className="btn-primary">▶ PLAY</button>
          <button className="btn-secondary">⬇ DOWNLOAD</button>
          <button className="btn-secondary">📤 SHARE</button>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="heading-md mb-3">SYNOPSIS</h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl">
            {movie.description}
          </p>
          {movie.director && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gold font-semibold text-sm">DIRECTOR</p>
                <p className="text-gray-300">{movie.director}</p>
              </div>
              {movie.box_office && (
                <div>
                  <p className="text-gold font-semibold text-sm">BOX OFFICE</p>
                  <p className="text-gray-300">{movie.box_office}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-16 z-20 bg-dark border-b border-gold/20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex gap-8 overflow-x-auto">
          <motion.div className="py-4 px-2 font-semibold text-sm text-gold">
            AUDIO SONGS ({audioSongs.length})
          </motion.div>
        </div>
      </div>

      {/* Audio Songs Content */}
      <div className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Audio Songs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {audioSongs.length > 0 ? (
                <>
                  <h3 className="heading-md mb-6">Audio Tracks</h3>
                  <motion.div
                    className="space-y-3 max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {audioSongs.map((song, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card-gold p-4 flex items-center gap-4 group hover:bg-gold/20 transition-all"
                      >
                        <div className="text-3xl text-gold font-bold w-12 text-center">
                          {song.track_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gold group-hover:text-golden line-clamp-1">
                            {song.title}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {song.artist} • {formatDuration(song.duration_seconds)}
                          </p>
                        </div>
                        <audio controls className="max-w-xs" controlsList="nodownload">
                          <source src={song.audio_url} type="audio/mpeg" />
                        </audio>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              ) : (
                <EmptyState
                  title="No Audio Songs Available"
                  description="Audio tracks for this movie will be available soon"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Back Button */}
      <div className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/movies" className="btn-secondary inline-block">
            ← Back to Movies
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
