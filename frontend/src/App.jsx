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

// Error boundary to catch and display React render errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('React Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#ff6b6b', background: '#0a0e27', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#d4af37', marginBottom: '16px' }}>⚠️ App crashed — error details:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '13px', color: '#ff9999' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
