// Format duration (seconds to MM:SS)
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Format views count (1000 -> 1K, 1000000 -> 1M)
export const formatViews = (views) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

// Get safe image URL
export const getSafeImageUrl = (url, fallback = null) => {
  if (!url) return fallback || null;
  return url;
};

// Handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    return error.response.data?.detail || error.response.data?.message || 'An error occurred';
  }
  if (error.request) {
    return 'No response from server. Please check your connection.';
  }
  return error.message || 'An unexpected error occurred';
};
