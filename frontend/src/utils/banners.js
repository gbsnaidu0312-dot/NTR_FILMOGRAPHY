import { getR2Url } from '../config/links';
import TigerIcon from '../assets/Tigericon.jpg';

/**
 * Map known movie names/slugs (lowercase, trimmed) → portrait filename in THUMBNAIL_P/
 * Also used to derive landscape filenames (same name + _L suffix).
 *
 * R2 structure:
 *   Portrait  → THUMBNAIL_P/{filename}        e.g. THUMBNAIL_P/AADI.png
 *   Landscape → THUMBNAILS/{name}_L.png       e.g. THUMBNAILS/AADI_L.png
 */
const MOVIE_TO_POSTER_MAP = {
  'ninnu choodalani': 'NINNU CHUDALANI.png',
  'student no1': 'STUDENT No1.png',
  'student no. 1': 'STUDENT No1.png',
  'subbu': 'SUBBU.png',
  'aadi': 'AADI.png',
  'aadi_': 'AADI.png',
  'allari ramudu': 'ALLARI RAMUDU.png',
  'naaga': 'NAAGA.png',
  'simhadri': 'SIMHADRI.png',
  'andhrawala': 'ANDHRAWALA.png',
  'samba': 'SAMBA.png',
  'naa alludu': 'NAA ALLUDU.png',
  'narasimhudu': 'NARASIMHUDU.png',
  'ashok': 'ASHOK.png',
  'rakhi': 'RAKHI.png',
  'yamadonga': 'YAMADONGA.png',
  'kantri': 'KANTRI.png',
  'adhurs': 'Adhurs.png',
  'brindaavanam': 'BRINDHAVANAM.png',
  'brindavanam': 'BRINDHAVANAM.png',
  'shakti': 'SHAKTI.png',
  'oosaravelli': 'Oosaravalli.png',
  'dhammu': 'DHAMMU.png',
  'baadshah': 'BAADSHAH.png',
  'ramayya vastavayya': 'RAMAYYA VASTAVAYYA.png',
  'ramayya vasthavayya': 'RAMAYYA VASTAVAYYA.png',
  'rabhasa': 'RABASA.png',
  'temper': 'TEMPER.png',
  'nannaku prematho': 'NKP.png',
  'nannaku prematho_': 'NKP.png',
  'jantha garage': 'JANATAGARAGE.png',
  'janatha garage': 'JANATAGARAGE.png',
  'janatha garage_': 'JANATAGARAGE.png',
  'jai lava kusa': 'JAI LAVAKUSA.png',
  'aravinda sametha': 'ARAVINDA SAMETHA.png',
  'rrr': 'RRR.png',
  'devara': 'DEVARA.png',
  'war2': 'WAR2.png',
  'war 2': 'WAR2.png',
};

// Landscape filename overrides — only needed when R2 landscape name ≠ portrait_name + _L
const MOVIE_LANDSCAPE_OVERRIDE = {
  'aravinda sametha':  'Aravindha Sametha_L.png',
  'aravindha sametha': 'Aravindha Sametha_L.png',
};

// Keep old name for backward compatibility (used by getFolderThumbnail callers)
const FOLDER_TO_POSTER_MAP = MOVIE_TO_POSTER_MAP;

/** Encode a filename for use in an R2 URL (spaces → %20) */
function encodeR2(filename) {
  return filename.replace(/ /g, '%20');
}

/** Returns true if a URL is a known placeholder (should be ignored) */
function isPlaceholder(url) {
  if (!url) return true;
  return url.includes('wp5283563.jpg') || url.includes('sample/79');
}

/** Look up a movie by title or slug in MOVIE_TO_POSTER_MAP */
function lookupMovieKey(movie) {
  if (!movie) return null;
  const byTitle = movie.title?.toLowerCase().trim();
  const bySlug  = movie.slug?.toLowerCase().trim()?.replace(/-/g, ' ');
  return MOVIE_TO_POSTER_MAP[byTitle] ? byTitle
       : MOVIE_TO_POSTER_MAP[bySlug]  ? bySlug
       : null;
}

/**
 * Get the landscape (hero background) banner URL for a movie.
 * R2 path: /THUMBNAILS/{NAME}_L.png
 * e.g. https://pub-xxx.r2.dev/THUMBNAILS/AADI_L.png
 */
export function getLandscapeBanner(movie) {
  if (!movie) return '/tiger-nation-logo-landscape.jpg';

  // Use backend URL only if it's a real (non-placeholder) URL
  if (!isPlaceholder(movie.banner_url)) {
    return movie.banner_url;
  }

  // Derive from MOVIE_TO_POSTER_MAP: portrait name + _L suffix → THUMBNAILS folder
  const key = lookupMovieKey(movie);
  if (key) {
    const portraitFile  = MOVIE_TO_POSTER_MAP[key];
    const landscapeFile = MOVIE_LANDSCAPE_OVERRIDE[key] || portraitFile.replace('.png', '_L.png');
    return getR2Url(`/THUMBNAILS/${encodeR2(landscapeFile)}`);
  }

  return '/tiger-nation-logo-landscape.jpg';
}

/**
 * Get the portrait (sidebar / card) thumbnail URL for a movie.
 * R2 path: /THUMBNAIL_P/{NAME}.png
 * e.g. https://pub-xxx.r2.dev/THUMBNAIL_P/AADI.png
 */
export function getPortraitBanner(movie) {
  if (!movie) return '/tiger-nation-logo-portrait.jpg';

  // Use backend URL only if it's a real (non-placeholder) URL
  if (!isPlaceholder(movie.poster_url)) {
    return movie.poster_url;
  }

  // Look up portrait filename from map → THUMBNAIL_P folder
  const key = lookupMovieKey(movie);
  if (key) {
    const portraitFile = MOVIE_TO_POSTER_MAP[key]; // e.g. "AADI.png"
    return getR2Url(`/THUMBNAIL_P/${encodeR2(portraitFile)}`);
  }

  return '/tiger-nation-logo-portrait.jpg';
}

/**
 * Get the portrait thumbnail URL for a photo folder card.
 * Uses THUMBNAIL_P/{NAME}.png from R2 for known movie folders,
 * falls back to TigerIcon for non-movie folders.
 */
export function getFolderThumbnail(folderName) {
  if (!folderName) return TigerIcon;

  const key = folderName.toLowerCase().trim();
  const filename = FOLDER_TO_POSTER_MAP[key];
  if (filename) {
    return getR2Url(`/THUMBNAIL_P/${encodeR2(filename)}`);
  }

  return TigerIcon;
}

// Re-export for any legacy imports
export { FOLDER_TO_POSTER_MAP };
