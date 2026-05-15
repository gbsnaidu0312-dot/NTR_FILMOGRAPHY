import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const moviesApi = {
  getAll: (page = 1) => api.get('/movies/', { params: { page } }),
  getBySlug: (slug) => api.get(`/movies/${slug}/`),
  getVideocuts: (slug) => api.get(`/movies/${slug}/video-cuts/`),
  getVideoSongs: (slug) => api.get(`/movies/${slug}/video-songs/`),
  getAudioSongs: (slug) => api.get(`/movies/${slug}/audio-songs/`),
  search: (query) => api.get('/movies/', { params: { search: query } }),
};

// Videos API
export const videosApi = {
  getAll: (type = null) => api.get('/videos/', { params: type ? { type } : {} }),
  getById: (id) => api.get(`/videos/${id}/`),
  getByType: (type) => api.get('/videos/', { params: { type } }),
  search: (query) => api.get('/videos/', { params: { search: query } }),
};

// Audio API
export const audioApi = {
  getAll: (page = 1) => api.get('/audio-songs/', { params: { page } }),
  getById: (id) => api.get(`/audio-songs/${id}/`),
  search: (query) => api.get('/audio-songs/', { params: { search: query } }),
};

// Photos API
export const photosApi = {
  getFolders: (type = null) => api.get('/photos/folders/', { params: type ? { type } : {} }),
  getFolderBySlug: (slug) => api.get(`/photos/folders/${slug}/`),
  getFolderSubfolders: (slug) => api.get(`/photos/folders/${slug}/subfolders/`),
  getPhotos: (folderId = null) => api.get('/photos/', { params: folderId ? { folder: folderId } : {} }),
  getPhotoById: (id) => api.get(`/photos/${id}/`),
};

export default api;
