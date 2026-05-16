/**
 * Banner mapping for NTR Filmography.
 * Maps movie title (lowercase) to landscape (L) and portrait (P) banner paths.
 *
 * IMPORTANT: All paths use %20 for spaces so CSS url() works correctly without quoting.
 *
 * Fallback when no local banner exists: Tiger Nation logo.
 */

/** Tiger Nation logo — used as fallback when a banner is missing */
export const TIGER_LOGO = '/tiger-nation-logo.jpg';

const BANNER_MAP = {

  // Adhurs / Aadhurs (2010)
  'adhurs': {
    landscape: '/banners/Aadhurs/Aadhurs%20L.png',
    portrait:  '/banners/Aadhurs/Aadhurs%20P.jpg',
  },

  // Aadi (2002)
  'aadi': {
    landscape: '/banners/Aadi/Aadi%20L.png',
    portrait:  '/banners/Aadi/Aadi%20P.png',
  },

  // Allari Ramudu (2002)
  'allari ramudu': {
    landscape: '/banners/Allari%20Ramudu/Allari%20Ramudu%20L.png',
    portrait:  '/banners/Allari%20Ramudu/Allari%20Ramudu%20P.jpg',
  },

  // Andhrawala (2004)
  'andhrawala': {
    landscape: '/banners/Andhrawala/Andhrawala%20L.png',
    portrait:  '/banners/Andhrawala/Andhrawala%20p.png',
  },

  // Ashok (2006)
  'ashok': {
    landscape: '/banners/Ashok/Ashok%20L.png',
    portrait:  '/banners/Ashok/Ashok%20P.jpg',
  },

  // Aravindha Sametha → ASVR (2018)
  'aravindha sametha': {
    landscape: '/banners/ASVR/ASVR%20L.png',
    portrait:  '/banners/ASVR/ASVR%20P.png',
  },

  // Brindavanam (2010)
  'brindavanam': {
    landscape: '/banners/Brindavanam/Brindavanam%20L.png',
    portrait:  '/banners/Brindavanam/Brindavanam%20P.png',
  },

  // Jai Lava Kusa → JLK (2017)
  'jai lava kusa': {
    landscape: '/banners/JLK/JLK%20L.png',
    portrait:  '/banners/JLK/JLK%20P.png',
  },

  // Janatha Garage → JNG (2016) — no landscape yet
  'janatha garage': {
    landscape: null,
    portrait:  '/banners/JNG/JNG%20P.png',
  },

  // Kantri (2008)
  'kantri': {
    landscape: '/banners/Kantri/Kantri%20L.png',
    portrait:  '/banners/Kantri/Kantri%20P.jpg',
  },

  // Naa Alludu (2005)
  'naa alludu': {
    landscape: '/banners/Naa%20Alludu/Naa%20Alludu%20L.png',
    portrait:  '/banners/Naa%20Alludu/Naa%20Alludu%20P.jpg',
  },

  // Naaga (2003)
  'naaga': {
    landscape: '/banners/Naaga/Naaga%20L.png',
    portrait:  '/banners/Naaga/Naaga%20P.jpg',
  },

  // Narasimhudu (2005)
  'narasimhudu': {
    landscape: '/banners/Narasimhudu/Narasimhudu%20L.png',
    portrait:  '/banners/Narasimhudu/Narasimhudu%20P.jpg',
  },

  // Nannaku Prematho → NKP (2016) — no landscape yet
  'nannaku prematho': {
    landscape: null,
    portrait:  '/banners/NKP/NKP%20P.png',
  },

  // Rabhasa (2014) — no landscape yet
  'rabhasa': {
    landscape: null,
    portrait:  '/banners/Rabhasa/Rabhasa%20P.png',
  },

  // Ramayya Vasthavayya → RMV (2013)
  'ramayya vasthavayya': {
    landscape: '/banners/RMV/RMV%20L.png',
    portrait:  '/banners/RMV/RMV%20P.png',
  },

  // Samba (2004)
  'samba': {
    landscape: '/banners/Sambha/Samba%20L.png',
    portrait:  '/banners/Sambha/Sambha%20P.jpg',
  },

  // Shakti (2011)
  'shakti': {
    landscape: '/banners/Shakti/Shakti%20L.png',
    portrait:  '/banners/Shakti/Shakti%20P.png',
  },

  // Simhadri (2003)
  'simhadri': {
    landscape: '/banners/Simhadri/Simhadri%20L.png',
    portrait:  '/banners/Simhadri/Simhadri%20P.jpg',
  },

  // Student No. 1 (2001)
  'student no. 1': {
    landscape: '/banners/Student%20No1/Student%20No1%20L.png',
    portrait:  '/banners/Student%20No1/Student%20No1%20P.png',
  },

  // Subbu (2001)
  'subbu': {
    landscape: '/banners/Subbu/Subbu%20L.png',
    portrait:  '/banners/Subbu/Subbu%20P.jpg',
  },

  // Temper (2015) — no landscape yet
  'temper': {
    landscape: null,
    portrait:  '/banners/Temper/Temper%20P.png',
  },

  // Yamadonga (2007)
  'yamadonga': {
    landscape: '/banners/Yamadonga/Yamadonga%20L.png',
    portrait:  '/banners/Yamadonga/Yamadonga%20P.jpg',
  },
};

/**
 * Get the landscape (hero background) banner URL for a movie.
 * Falls back to Tiger Nation logo when no local banner exists.
 *
 * @param {string} title — movie.title from the API
 * @returns {string}
 */
export function getLandscapeBanner(title) {
  const key = (title || '').toLowerCase().trim();
  const entry = BANNER_MAP[key];
  if (entry && entry.landscape) return entry.landscape;
  return TIGER_LOGO;
}

/**
 * Get the portrait (sidebar thumbnail) banner URL for a movie.
 * Falls back to Tiger Nation logo when no local banner exists.
 *
 * @param {string} title — movie.title from the API
 * @param {string} [apiFallback] — API poster_url to try before logo
 * @returns {string}
 */
export function getPortraitBanner(title, apiFallback) {
  const key = (title || '').toLowerCase().trim();
  const entry = BANNER_MAP[key];
  if (entry && entry.portrait) return entry.portrait;
  if (apiFallback) return apiFallback;
  return TIGER_LOGO;
}
