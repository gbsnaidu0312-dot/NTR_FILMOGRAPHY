/**
 * Cloudflare Pages Function: /download
 *
 * Proxies Cloudflare R2 objects and forces a browser Save-As dialog by
 * injecting `Content-Disposition: attachment`.  Because this runs at the
 * same origin as the site (ntrfilmography.live), the browser's native
 * download manager takes over — no CORS issues, no loading the file into
 * memory, large files (1-2 GB movies) work correctly.
 *
 * Usage:
 *   GET /download?url=<encoded-r2-url>&filename=<encoded-filename>
 *
 * Only URLs from the authorised R2 bucket are allowed.
 */

const ALLOWED_R2_ORIGIN = 'https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev';

export async function onRequestGet({ request }) {
  const { searchParams } = new URL(request.url);
  const r2Url   = searchParams.get('url');
  const filename = searchParams.get('filename') || 'download';

  // --- Validate ----------------------------------------------------------
  if (!r2Url) {
    return new Response('Missing `url` parameter', { status: 400 });
  }
  if (!r2Url.startsWith(ALLOWED_R2_ORIGIN + '/')) {
    return new Response('Forbidden: URL not from authorised R2 bucket', { status: 403 });
  }

  // --- Fetch from R2 (supports Range for resumable / partial downloads) ---
  const rangeHeader = request.headers.get('Range');
  const upstreamHeaders = {};
  if (rangeHeader) upstreamHeaders['Range'] = rangeHeader;

  let upstream;
  try {
    upstream = await fetch(r2Url, { headers: upstreamHeaders });
  } catch (err) {
    return new Response(`Failed to fetch from R2: ${err.message}`, { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(`R2 returned ${upstream.status}`, { status: upstream.status });
  }

  // --- Build response headers -------------------------------------------
  const headers = new Headers();

  // Pass through essential headers from R2
  const passthroughHeaders = [
    'Content-Type', 'Content-Length', 'Content-Range',
    'ETag', 'Last-Modified', 'Cache-Control',
  ];
  for (const h of passthroughHeaders) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  // Force the browser to save the file instead of displaying it
  const safeFilename = filename.replace(/["\\\n\r]/g, '_');
  headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);

  // Accept-Ranges so the browser download manager can resume large files
  headers.set('Accept-Ranges', 'bytes');

  // Allow the frontend to call this endpoint
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(upstream.body, {
    status: upstream.status,   // 200 or 206 (partial content)
    headers,
  });
}

// Handle pre-flight OPTIONS requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    },
  });
}
