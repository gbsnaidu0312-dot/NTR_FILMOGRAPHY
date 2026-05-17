import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from './components/Common';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { PhotosPage } from './pages/PhotosPage';
import { VideosCutsPage } from './pages/VideosCutsPage';
import { VideosPage } from './pages/VideosPage';
import { BiographyPage } from './pages/BiographyPage';
import {
  VideoSongsPage,
  MovieCutsPage,
  VideoSongsFolderPage,
  MovieCutsFolderPage,
  EventsPage,
  CelebrationsPage,
  EventsFolderPage,
  CelebrationsFolderPage
} from './pages/VideoCategoryPages';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <Navigation />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:slug" element={<MovieDetailsPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            
            {/* Video Cuts Hierarchy */}
            <Route path="/video-cuts" element={<VideosCutsPage />} />
            <Route path="/video-cuts/video-songs" element={<VideoSongsPage />} />
            <Route path="/video-cuts/video-songs/:folderName" element={<VideoSongsFolderPage />} />
            <Route path="/video-cuts/movie-cuts" element={<MovieCutsPage />} />
            <Route path="/video-cuts/movie-cuts/:folderName" element={<MovieCutsFolderPage />} />
            
            {/* Videos Hierarchy */}
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/videos/events" element={<EventsPage />} />
            <Route path="/videos/events/:folderName" element={<EventsFolderPage />} />
            <Route path="/videos/celebrations" element={<CelebrationsPage />} />
            <Route path="/videos/celebrations/:folderName" element={<CelebrationsFolderPage />} />

            <Route path="/biography" element={<BiographyPage />} />
            
            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-dark flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="heading-xl mb-4">404</h1>
                    <p className="text-gray-300 mb-8">Page not found</p>
                    <a href="/" className="btn-primary inline-block">
                      Back to Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
