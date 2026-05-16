/**
 * Banner mapping for NTR Filmography.
 * Maps movie title (or slug key) to landscape (L) and portrait (P) banner paths.
 *
 * Folder naming convention in /public/banners/:
 *   <FolderName>/<FolderName> L.<ext>   — landscape banner (hero background)
 *   <FolderName>/<FolderName> P.<ext>   — portrait banner  (sidebar thumbnail)
 *
 * Some movies use abbreviations (ASVR, JLK, JNG, NKP, RMV).
 * Some portrait files have lowercase "p" — all paths are handled here.
 */

const BANNER_MAP = {
  // title (lowercase, trimmed) → { landscape, portrait }

  // Adhurs / Aadhurs
  'adhurs': {
    landscape: '/banners/Aadhurs/Aadhurs L.png',
    portrait: '/banners/Aadhurs/Aadhurs P.jpg',
  },

  // Aadi
  'aadi': {
    landscape: '/banners/Aadi/Aadi L.png',
    portrait: '/banners/Aadi/Aadi P.png',
  },

  // Allari Ramudu
  'allari ramudu': {
    landscape: '/banners/Allari Ramudu/Allari Ramudu L.png',
    portrait: '/banners/Allari Ramudu/Allari Ramudu P.jpg',
  },

  // Andhrawala
  'andhrawala': {
    landscape: '/banners/Andhrawala/Andhrawala L.png',
    portrait: '/banners/Andhrawala/Andhrawala p.png',
  },

  // Ashok
  'ashok': {
    landscape: '/banners/Ashok/Ashok L.png',
    portrait: '/banners/Ashok/Ashok P.jpg',
  },

  // Aravindha Sametha Veera Raghava → ASVR
  'aravindha sametha': {
    landscape: '/banners/ASVR/ASVR L.png',
    portrait: '/banners/ASVR/ASVR P.png',
  },

  // Brindavanam
  'brindavanam': {
    landscape: '/banners/Brindavanam/Brindavanam L.png',
    portrait: '/banners/Brindavanam/Brindavanam P.png',
  },

  // Jai Lava Kusa → JLK
  'jai lava kusa': {
    landscape: '/banners/JLK/JLK L.png',
    portrait: '/banners/JLK/JLK P.png',
  },

  // Janatha Garage → JNG
  'janatha garage': {
    landscape: null,                          // no landscape banner available
    portrait: '/banners/JNG/JNG P.png',
  },

  // Kantri
  'kantri': {
    landscape: '/banners/Kantri/Kantri L.png',
    portrait: '/banners/Kantri/Kantri P.jpg',
  },

  // Naa Alludu
  'naa alludu': {
    landscape: '/banners/Naa Alludu/Naa Alludu L.png',
    portrait: '/banners/Naa Alludu/Naa Alludu P.jpg',
  },

  // Naaga
  'naaga': {
    landscape: '/banners/Naaga/Naaga L.png',
    portrait: '/banners/Naaga/Naaga P.jpg',
  },

  // Narasimhudu
  'narasimhudu': {
    landscape: '/banners/Narasimhudu/Narasimhudu L.png',
    portrait: '/banners/Narasimhudu/Narasimhudu P.jpg',
  },

  // Nannaku Prematho → NKP
  'nannaku prematho': {
    landscape: null,
    portrait: '/banners/NKP/NKP P.png',
  },


  // Rabhasa
  'rabhasa': {
    landscape: null,
    portrait: '/banners/Rabhasa/Rabhasa P.png',
  },

  // Ramayya Vasthavayya → RMV
  'ramayya vasthavayya': {
    landscape: '/banners/RMV/RMV L.png',
    portrait: '/banners/RMV/RMV P.png',
  },

  // Samba
  'samba': {
    landscape: '/banners/Sambha/Samba L.png',
    portrait: '/banners/Sambha/Sambha P.jpg',
  },

  // Shakti
  'shakti': {
    landscape: '/banners/Shakti/Shakti L.png',
    portrait: '/banners/Shakti/Shakti P.png',
  },

  // Simhadri
  'simhadri': {
    landscape: '/banners/Simhadri/Simhadri L.png',
    portrait: '/banners/Simhadri/Simhadri P.jpg',
  },

  // Student No. 1
  'student no. 1': {
    landscape: '/banners/Student No1/Student No1 L.png',
    portrait: '/banners/Student No1/Student No1 P.png',
  },

  // Subbu
  'subbu': {
    landscape: '/banners/Subbu/Subbu L.png',
    portrait: '/banners/Subbu/Subbu P.jpg',
  },

  // Temper
  'temper': {
    landscape: null,
    portrait: '/banners/Temper/Temper P.png',
  },

  // Yamadonga
  'yamadonga': {
    landscape: '/banners/Yamadonga/Yamadonga L.png',
    portrait: '/banners/Yamadonga/Yamadonga P.jpg',
  },
};

/**
 * Get the landscape (hero background) banner URL for a movie.
 * Falls back to the movie's existing banner_url / poster_url, then to null.
 *
 * @param {string} title  — movie.title from the API
 * @param {string} fallback — URL to use if no local banner exists
 * @returns {string|null}
 */
export function getLandscapeBanner(title, fallback = null) {
  const key = (title || '').toLowerCase().trim();
  const entry = BANNER_MAP[key];
  if (entry && entry.landscape) return entry.landscape;
  return fallback;
}

/**
 * Get the portrait (sidebar thumbnail) banner URL for a movie.
 *
 * @param {string} title  — movie.title from the API
 * @param {string} fallback — URL to use if no local banner exists
 * @returns {string|null}
 */
export function getPortraitBanner(title, fallback = null) {
  const key = (title || '').toLowerCase().trim();
  const entry = BANNER_MAP[key];
  if (entry && entry.portrait) return entry.portrait;
  return fallback;
}
