/**
 * Force-download a file from a URL.
 * Uses fetch + blob so the browser saves it instead of opening in a new tab.
 * Falls back gracefully if CORS or network errors occur.
 *
 * @param {string} url      - Full URL of the file to download
 * @param {string} filename - Suggested filename for the saved file
 */
export async function downloadFile(url, filename) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    triggerDownload(blobUrl, filename);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn('Blob download failed, trying direct link:', err);
    // Fallback: direct anchor download (works if same-origin or CORS allows it)
    triggerDownload(url, filename);
  }
}

function triggerDownload(href, filename) {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
