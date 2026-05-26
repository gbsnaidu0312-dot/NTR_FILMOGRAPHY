/**
 * Force-download a file from a URL.
 *
 * For R2 cross-origin URLs the browser ignores the `download` attribute and
 * loading a 2 GB file into a Blob is not feasible.  Instead we route through
 * the /download Cloudflare Pages Function which:
 *   1. Fetches the file from R2 at the edge (fast, no memory issue)
 *   2. Adds `Content-Disposition: attachment` so the browser always saves it
 *   3. Forwards Range headers so large downloads are resumable
 *
 * In local development the Vite dev-server doesn't have the CF Function, so
 * we fall back to a plain anchor click (opens the file; use `wrangler pages dev`
 * locally if you need to test the full flow).
 *
 * @param {string} url      - Full URL of the file (R2 or any absolute URL)
 * @param {string} filename - Suggested filename for the saved file
 */
export function downloadFile(url, filename) {
  const isR2 = url.startsWith('https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev/');
  const isDev = import.meta.env.DEV;

  if (isR2 && !isDev) {
    // Route through the same-origin CF Pages Function proxy.
    // Same-origin means: (a) no CORS issues, (b) `download` attribute is
    // honoured by the browser, (c) the native download manager streams the
    // file — no memory spike regardless of file size.
    const proxy = `/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    triggerDownload(proxy, filename);
  } else {
    // Local dev or non-R2 URL: plain anchor click.
    // For R2 URLs in dev this navigates to the file (opens / plays it) which
    // is good enough for development testing.
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
