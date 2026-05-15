/**
 * NTR Filmography — Social Media & External Links
 * Centralized config file. Update links here for all pages.
 */
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://www.instagram.com/jrntr/',
  YOUTUBE: 'https://www.youtube.com/jrNTRofficial',
  X: 'https://x.com/tarak9999',
};

/**
 * Cloudflare R2 Media Configuration
 */
export const R2_CONFIG = {
  PUBLIC_URL: import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev',
};

// Helper to build full R2 URLs
export const getR2Url = (path) => `${R2_CONFIG.PUBLIC_URL}${path}`;
