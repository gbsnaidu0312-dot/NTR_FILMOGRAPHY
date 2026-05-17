"""
Media Library Utility - Loads and queries media-library.json
Provides access to the canonical file listing from the R2 bucket.
"""
import json
import logging
from typing import Dict, Any, List, Generator, Tuple, Optional

from config.media_config import MEDIA_LIBRARY_PATH

logger = logging.getLogger(__name__)


class MediaLibrary:
    """Loads and provides access to media-library.json (the canonical file listing)."""

    _data: Optional[Dict[str, Any]] = None

    @classmethod
    def load(cls) -> Dict[str, Any]:
        """Lazy-load the JSON data once and cache it."""
        if cls._data is None:
            try:
                with open(MEDIA_LIBRARY_PATH, 'r', encoding='utf-8') as f:
                    cls._data = json.load(f)
                
                if cls._data is None:
                    cls._data = {}
                
                total = cls._count_files(cls._data)
                logger.info(f"Loaded media library: {total} files across {len(cls._data)} categories")
            except Exception as e:
                logger.error(f"Failed to load media library: {e}")
                cls._data = {}
        return cls._data

    @classmethod
    def reload(cls):
        """Force reload the JSON data."""
        cls._data = None
        return cls.load()

    @classmethod
    def _count_files(cls, node):
        """Recursively count files entries in the data tree."""
        count = 0
        if isinstance(node, dict):
            files = node.get('files', node.get('_files', []))
            if isinstance(files, list):
                count += len(files)
            for key, value in node.items():
                if key not in ['files', '_files']:
                    count += cls._count_files(value)
        return count

    # ── Audio ──────────────────────────────────────────────

    @classmethod
    def get_audio_files(cls, movie_folder: str) -> List[str]:
        """Get list of audio filenames for a given movie folder.

        Args:
            movie_folder: The folder name in R2 (e.g., 'Aadi', 'Devara')

        Returns:
            List of filenames (e.g., ['Ayyo Rama.mp3', ...]) or empty list
        """
        data = cls.load() or {}
        audio_section = data.get('Audio', {}) or {}
        movie_audio = audio_section.get(movie_folder, {}) or {}
        return (movie_audio.get('files') or movie_audio.get('_files') or [])

    @classmethod
    def get_all_audio_folders(cls) -> List[str]:
        """Get all movie folder names that have audio entries."""
        data = cls.load() or {}
        audio_section = data.get('Audio', {}) or {}
        return [k for k in audio_section.keys() if k not in ['files', '_files']]

    # ── Movies ─────────────────────────────────────────────

    @classmethod
    def get_movie_files(cls) -> List[str]:
        """Get list of movie filenames (e.g., 'Aadi (2002).mkv')."""
        data = cls.load() or {}
        movies = data.get('Movies', {}) or {}
        return (movies.get('files') or movies.get('_files') or [])

    # ── Photos ─────────────────────────────────────────────

    @classmethod
    def get_photo_files(cls, folder_path_parts: List[str]) -> List[str]:
        """Get photo filenames by traversing the Photos hierarchy.

        Args:
            folder_path_parts: List of path segments, e.g.
                ['Event', 'ADDS', 'Appy fizz']

        Returns:
            List of filenames or empty list
        """
        data = cls.load() or {}
        current = data.get('Photos', {}) or {}
        for part in folder_path_parts:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return []
        if isinstance(current, dict):
            return (current.get('files') or current.get('_files') or [])
        return []

    @classmethod
    def walk_photo_folders(cls) -> Generator[Tuple[List[str], List[str]], None, None]:
        """Walk the entire Photos hierarchy.

        Yields:
            (folder_path_parts, files) tuples
            folder_path_parts is a list like ['Event', 'ADDS', 'Appy fizz']
            files is the list of _files in that folder
        """
        data = cls.load() or {}
        photos = data.get('Photos', {}) or {}

        def _walk(node, path_parts):
            if not isinstance(node, dict):
                return
            files = node.get('files', node.get('_files', []))
            if files:
                yield path_parts, files
            for key, value in node.items():
                if key not in ['files', '_files']:
                    yield from _walk(value, path_parts + [key])

        yield from _walk(photos, [])

    # ── Video Cuts ─────────────────────────────────────────

    @classmethod
    def get_video_cut_files(cls, cut_type: str, folder: str) -> List[str]:
        """Get video cut filenames.

        Args:
            cut_type: 'Movie Cuts' or 'Video Songs'
            folder: Folder name (e.g., 'Aadi_', 'Devara')

        Returns:
            List of filenames or empty list
        """
        data = cls.load() or {}
        vc = data.get('VideoCuts', {}) or {}
        type_section = vc.get(cut_type, {}) or {}
        folder_section = type_section.get(folder, {}) or {}
        return (folder_section.get('files') or folder_section.get('_files') or [])

    @classmethod
    def get_video_cut_subfolders(cls, cut_type: str, folder: str) -> Dict[str, Any]:
        """Get subfolder names within a video cut folder (e.g., '4k').

        Args:
            cut_type: 'Movie Cuts' or 'Video Songs'
            folder: Folder name

        Returns:
            Dict of {subfolder_name: child_node}
        """
        data = cls.load() or {}
        vc = data.get('VideoCuts', {}) or {}
        type_section = vc.get(cut_type, {}) or {}
        folder_section = type_section.get(folder, {}) or {}
        return {k: v for k, v in folder_section.items() if k not in ['files', '_files']}

    @classmethod
    def get_all_video_cut_folders(cls, cut_type: str) -> List[str]:
        """Get all folder names within a video cut type."""
        data = cls.load() or {}
        vc = data.get('VideoCuts', {}) or {}
        type_section = vc.get(cut_type, {}) or {}
        return [k for k in type_section.keys() if k not in ['files', '_files']]

    # ── Videos (Events / Celebrations / Ads) ───────────────

    @classmethod
    def get_video_category_files(cls, category: str, folder: str) -> List[str]:
        """Get video files from a category.

        Args:
            category: Top-level Videos subfolder (e.g., 'Celebrations', 'Events')
            folder: Specific folder name within that category

        Returns:
            List of filenames or empty list
        """
        data = cls.load() or {}
        videos = data.get('Videos', {}) or {}
        cat_section = videos.get(category, {}) or {}
        folder_section = cat_section.get(folder, {}) or {}
        return (folder_section.get('files') or folder_section.get('_files') or [])

    @classmethod
    def walk_video_categories(cls) -> Generator[Tuple[str, str, List[str]], None, None]:
        """Walk all Videos subcategories and their folders.

        Yields:
            (category, folder_name, files) tuples
        """
        data = cls.load() or {}
        videos = data.get('Videos', {}) or {}
        for category, cat_data in videos.items():
            if not isinstance(cat_data, dict):
                continue
            for folder_name, folder_data in cat_data.items():
                if folder_name in ['files', '_files']:
                    continue
                if isinstance(folder_data, dict):
                    files = (folder_data.get('files') or folder_data.get('_files') or [])
                    if files:
                        yield category, folder_name, files
                    # Check for nested subfolders
                    for sub_key, sub_val in folder_data.items():
                        if sub_key not in ['files', '_files'] and isinstance(sub_val, dict):
                            sub_files = (sub_val.get('files') or sub_val.get('_files') or [])
                            if sub_files:
                                yield category, f'{folder_name}/{sub_key}', sub_files
