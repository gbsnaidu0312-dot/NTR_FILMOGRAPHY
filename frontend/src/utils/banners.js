import { getR2Url } from '../config/links';
import TigerIcon from '../assets/Tigericon.jpg';

/**
 * Banner mapping for NTR Filmography.
 * Dynamically fetches from Cloudflare R2 bucket instead of local files.
 * 
 * Assumes you will upload files to R2 in a `/banners/` folder like:
 *   /banners/{slug}-landscape.jpg
 *   /banners/{slug}-portrait.jpg
 */

/**
 * Get the landscape (hero background) banner URL for a movie.
 *
 * @param {Object} movie  — movie object from the API
 * @returns {string}
 */
export function getLandscapeBanner(movie) {
  if (!movie) return '/tiger-nation-logo-landscape.jpg';
  
  // If the backend has a specific banner_url (and it's not the old default placeholder), use it
  if (movie.banner_url && !movie.banner_url.includes('wp5283563.jpg')) {
    return movie.banner_url;
  }

  // Otherwise, fallback to the new R2 folder structure using the slug
  if (movie.slug) {
    return getR2Url(`/banners/${movie.slug}-landscape.jpg`);
  }
  
  return '/tiger-nation-logo-landscape.jpg';
}

/**
 * Get the portrait (sidebar thumbnail) banner URL for a movie.
 *
 * @param {Object} movie  — movie object from the API
 * @returns {string}
 */
export function getPortraitBanner(movie) {
  if (!movie) return '/tiger-nation-logo-portrait.jpg';
  
  // If the backend has a specific poster_url (and it's not the old default placeholder), use it
  if (movie.poster_url && !movie.poster_url.includes('wp5283563.jpg')) {
    return movie.poster_url;
  }

  // Otherwise, fallback to the new R2 folder structure using the slug
  if (movie.slug) {
    return getR2Url(`/banners/${movie.slug}-portrait.jpg`);
  }
  
  return '/tiger-nation-logo-portrait.jpg';
}

/**
 * Map known folder names (lowercase, trimmed) to their exact portrait filename.
 * If a folder matches a movie, we use its poster.
 */
const FOLDER_TO_POSTER_MAP = {
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

/**
 * Get the portrait thumbnail URL for a folder.
 * Uses THUMBNAIL_P bucket files for movies, or Tigericon.jpg for non-movies.
 *
 * @param {string} folderName  — folder name from API
 * @returns {string}
 */
export function getFolderThumbnail(folderName) {
  if (!folderName) return TigerIcon;

  // Case-insensitive trimmed lookup
  const key = folderName.toLowerCase().trim();
  const filename = FOLDER_TO_POSTER_MAP[key];
  if (filename) {
    // encodeURIComponent handles spaces but leaves other things, safer to just replace spaces for R2
    const encodedFilename = filename.replace(/ /g, '%20');
    return `https://ntrfilmography.live/THUMBNAIL_P/${encodedFilename}`;
  }

  // Fallback for non-movie folders
  return TigerIcon;
}
