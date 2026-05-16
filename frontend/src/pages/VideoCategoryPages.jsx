import React from 'react';
import { VideoFoldersListPage } from './VideoFoldersListPage';
import { VideoFolderDetailPage } from './VideoFolderDetailPage';

// ─── Video Cuts Category Pages ────────────────────────────────────────────────
export const VideoSongsPage = () => (
  <VideoFoldersListPage 
    videoType="song" 
    title="VIDEO SONGS" 
    subtitle="Select a movie to browse its video songs" 
    backPath="/video-cuts" 
    folderBasePath="/video-cuts/video-songs" 
  />
);

export const MovieCutsPage = () => (
  <VideoFoldersListPage 
    videoType="cut" 
    title="MOVIE CUTS" 
    subtitle="Select a movie to browse its movie cuts" 
    backPath="/video-cuts" 
    folderBasePath="/video-cuts/movie-cuts" 
  />
);

export const VideoSongsFolderPage = () => (
  <VideoFolderDetailPage 
    videoType="song" 
    backPath="/video-cuts/video-songs" 
    titlePrefix="Video Songs" 
  />
);

export const MovieCutsFolderPage = () => (
  <VideoFolderDetailPage 
    videoType="cut" 
    backPath="/video-cuts/movie-cuts" 
    titlePrefix="Movie Cuts" 
  />
);

// ─── Videos Category Pages ────────────────────────────────────────────────────
export const EventsPage = () => (
  <VideoFoldersListPage 
    videoType="event" 
    title="EVENTS & ADS" 
    subtitle="Browse press events, ads & appearances" 
    backPath="/videos" 
    folderBasePath="/videos/events" 
  />
);

export const CelebrationsPage = () => (
  <VideoFoldersListPage 
    videoType="celebration" 
    title="CELEBRATIONS" 
    subtitle="Browse success meets & fan events" 
    backPath="/videos" 
    folderBasePath="/videos/celebrations" 
  />
);

export const EventsFolderPage = () => (
  <VideoFolderDetailPage 
    videoType="event" 
    backPath="/videos/events" 
    titlePrefix="Events & Ads" 
  />
);

export const CelebrationsFolderPage = () => (
  <VideoFolderDetailPage 
    videoType="celebration" 
    backPath="/videos/celebrations" 
    titlePrefix="Celebrations" 
  />
);
