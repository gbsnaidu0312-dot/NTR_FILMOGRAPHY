"""
Media Library Utility - Loads and queries media-library.json
Provides access to the canonical file listing from the R2 bucket.
"""
import json
import logging

from config.media_config import MEDIA_LIBRARY_PATH

logger = logging.getLogger(__name__)


class MediaLibrary:
    """Loads and provides access to media-library.json (the canonical file listing)."""

    _data = None

    @classmethod
    def load(cls):
        """Lazy-load the JSON data once and cache it."""
        if cls._data is None:
            try:
                with open(MEDIA_LIBRARY_PATH, 'r', encoding='utf-8') as f:
                    cls._data = json.load(f)
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
        """Recursively count _files entries in the data tree."""
        count = 0
        if isinstance(node, dict):
            if '_files' in node and isinstance(node['_files'], list):
                count += len(node['_files'])
            for key, value in node.items():
                if key != '_files':
                    count += cls._count_files(value)
        return count

    # ── Audio ──────────────────────────────────────────────

    @classmethod
    def get_audio_files(cls, movie_folder):
        """Get list of audio filenames for a given movie folder.

        Args:
            movie_folder: The folder name in R2 (e.g., 'Aadi', 'Devara')

        Returns:
            List of filenames (e.g., ['Ayyo Rama.mp3', ...]) or empty list
        """
        data = cls.load()
        audio_section = data.get('Audio', {})
        movie_audio = audio_section.get(movie_folder, {})
        return movie_audio.get('_files', [])

    @classmethod
    def get_all_audio_folders(cls):
        """Get all movie folder names that have audio entries."""
        data = cls.load()
        audio_section = data.get('Audio', {})
        return [k for k in audio_section.keys() if k != '_files']

    # ── Movies ─────────────────────────────────────────────

    @classmethod
    def get_movie_files(cls):
        """Get list of movie filenames (e.g., 'Aadi (2002).mkv')."""
        data = cls.load()
        return data.get('Movies', {}).get('_files', [])

    # ── Photos ─────────────────────────────────────────────

    @classmethod
    def get_photo_files(cls, folder_path_parts):
        """Get photo filenames by traversing the Photos hierarchy.

        Args:
            folder_path_parts: List of path segments, e.g.
                ['Event', 'ADDS', 'Appy fizz']

        Returns:
            List of filenames or empty list
        """
        data = cls.load()
        current = data.get('Photos', {})
        for part in folder_path_parts:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return []
        if isinstance(current, dict):
            return current.get('_files', [])
        return []

    @classmethod
    def walk_photo_folders(cls):
        """Walk the entire Photos hierarchy.

        Yields:
            (folder_path_parts, files) tuples
            folder_path_parts is a list like ['Event', 'ADDS', 'Appy fizz']
            files is the list of _files in that folder
        """
        data = cls.load()
        photos = data.get('Photos', {})

        def _walk(node, path_parts):
            if not isinstance(node, dict):
                return
            files = node.get('_files', [])
            if files:
                yield path_parts, files
            for key, value in node.items():
                if key != '_files':
                    yield from _walk(value, path_parts + [key])

        yield from _walk(photos, [])

    # ── Video Cuts ─────────────────────────────────────────

    @classmethod
    def get_video_cut_files(cls, cut_type, folder):
        """Get video cut filenames.

        Args:
            cut_type: 'Movie Cuts' or 'Video Songs'
            folder: Folder name (e.g., 'Aadi_', 'Devara')

        Returns:
            List of filenames or empty list
        """
        data = cls.load()
        vc = data.get('VideoCuts', {})
        type_section = vc.get(cut_type, {})
        folder_section = type_section.get(folder, {})
        return folder_section.get('_files', [])

    @classmethod
    def get_video_cut_subfolders(cls, cut_type, folder):
        """Get subfolder names within a video cut folder (e.g., '4k').

        Args:
            cut_type: 'Movie Cuts' or 'Video Songs'
            folder: Folder name

        Returns:
            Dict of {subfolder_name: child_node}
        """
        data = cls.load()
        vc = data.get('VideoCuts', {})
        type_section = vc.get(cut_type, {})
        folder_section = type_section.get(folder, {})
        return {k: v for k, v in folder_section.items() if k != '_files'}

    @classmethod
    def get_all_video_cut_folders(cls, cut_type):
        """Get all folder names within a video cut type."""
        data = cls.load()
        vc = data.get('VideoCuts', {})
        type_section = vc.get(cut_type, {})
        return [k for k in type_section.keys() if k != '_files']

    # ── Videos (Events / Celebrations / Ads) ───────────────

    @classmethod
    def get_video_category_files(cls, category, folder):
        """Get video files from a category.

        Args:
            category: Top-level Videos subfolder (e.g., 'Celebrations', 'Events')
            folder: Specific folder name within that category

        Returns:
            List of filenames or empty list
        """
        data = cls.load()
        videos = data.get('Videos', {})
        cat_section = videos.get(category, {})
        folder_section = cat_section.get(folder, {})
        return folder_section.get('_files', [])

    @classmethod
    def walk_video_categories(cls):
        """Walk all Videos subcategories and their folders.

        Yields:
            (category, folder_name, files) tuples
        """
        data = cls.load()
        videos = data.get('Videos', {})
        for category, cat_data in videos.items():
            if not isinstance(cat_data, dict):
                continue
            for folder_name, folder_data in cat_data.items():
                if folder_name == '_files':
                    continue
                if isinstance(folder_data, dict):
                    files = folder_data.get('_files', [])
                    if files:
                        yield category, folder_name, files
                    # Check for nested subfolders
                    for sub_key, sub_val in folder_data.items():
                        if sub_key != '_files' and isinstance(sub_val, dict):
                            sub_files = sub_val.get('_files', [])
                            if sub_files:
                                yield category, f'{folder_name}/{sub_key}', sub_files
