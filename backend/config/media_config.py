"""
NTR Filmography - Centralized Media Path Configuration
Single source of truth for all media base paths and URL construction.
"""
import os
from pathlib import Path
from urllib.parse import quote

# Base URL for all media (Cloudflare R2 public URL)
# Set MEDIA_BASE_URL env var in Railway to override.
# Default: the R2 public bucket URL (works everywhere).
MEDIA_BASE_URL = os.environ.get(
    'MEDIA_BASE_URL',
    'https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev'
)

# Media type path prefixes (matching R2 bucket folder structure on the custom domain)
MEDIA_PATHS = {
    'audio': '/Audio/',
    'movies': '/Movies/',
    'photos': '/Photos/',
    'video_cuts': '/VideoCuts/',
    'videos': '/Videos/',
}

# Path to the canonical media library JSON file
MEDIA_LIBRARY_PATH = Path(__file__).resolve().parent.parent / 'full_media_structure.json'


def build_media_url(media_type, *path_segments):
    """Build a properly encoded media URL from path segments.

    Args:
        media_type: One of 'audio', 'movies', 'photos', 'video_cuts', 'videos'
        *path_segments: Variable number of path components to append

    Returns:
        Full URL string with proper encoding
    """
    base = MEDIA_PATHS[media_type]
    for segment in path_segments:
        base += str(segment).strip('/') + '/'
    base = base.rstrip('/')
    # URL-encode spaces and special characters
    encoded = quote(base, safe='/:')
    return f'{MEDIA_BASE_URL}{encoded}'


def build_audio_url(movie_folder, filename):
    """Build full audio URL: /Audio/{movie_folder}/{filename}"""
    return build_media_url('audio', movie_folder, filename)


def build_movie_url(filename):
    """Build full movie URL: /Movies/{filename}"""
    return build_media_url('movies', filename)


def build_photo_url(*path_segments, filename):
    """Build full photo URL: /Photos/{segments...}/{filename}"""
    segments = list(path_segments) + [filename]
    return build_media_url('photos', *segments)


def build_video_cut_url(cut_type, folder, filename):
    """Build video cut URL: /VideoCuts/{cut_type}/{folder}/{filename}"""
    return build_media_url('video_cuts', cut_type, folder, filename)


def build_video_url(category, folder, filename):
    """Build video URL: /Videos/{category}/{folder}/{filename}"""
    return build_media_url('videos', category, folder, filename)


def build_portrait_url(filename):
    """Build portrait thumbnail URL: /THUMBNAIL_P/{filename}
    e.g. https://ntrfilmography.live/THUMBNAIL_P/AADI.png
    """
    encoded = quote(filename, safe='')
    return f'{MEDIA_BASE_URL}/THUMBNAIL_P/{encoded}'


def build_landscape_url(filename):
    """Build landscape banner URL: /THUMBNAILS/{name}_L.png
    e.g. https://ntrfilmography.live/THUMBNAILS/AADI_L.png
    Accepts the portrait filename (AADI.png) and converts to landscape (_L.png).
    """
    landscape_file = filename.replace('.png', '_L.png')
    encoded = quote(landscape_file, safe='')
    return f'{MEDIA_BASE_URL}/THUMBNAILS/{encoded}'


def build_root_file_url(filename):
    """Build URL for a file at the bucket root (e.g. poster, banner images).

    Args:
        filename: Just the filename (e.g. 'wp5283563.jpg')

    Returns:
        Full URL like https://ntrfilmography.live/wp5283563.jpg
    """
    encoded = quote(filename, safe='')
    return f'{MEDIA_BASE_URL}/{encoded}'
