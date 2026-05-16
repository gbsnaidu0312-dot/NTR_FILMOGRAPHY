#!/usr/bin/env python
"""
Seed script to populate database from media-library.json.
Uses MediaLibrary for file listings and media_config for URL construction.
No more pattern-guessing or HTTP requests.

Usage:
    cd backend
    python manage.py shell < scripts/seed_from_r2.py
"""
import os
import sys
import re
import django

# Determine project root: use __file__ if available, else current working directory
if '__file__' in globals():
    PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
else:
    PROJECT_ROOT = os.getcwd()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, PROJECT_ROOT)
django.setup()

from django.utils.text import slugify
from apps.movies.models import Movie
from apps.videos.models import Video
from apps.audio.models import AudioSong
from apps.photos.models import PhotoFolder, Photo

# Import movie metadata
from scripts.movie_data import (
    MOVIES,
    MOVIE_PHOTO_FOLDER_MAP, VIDEO_SONG_FOLDER_MAP, MOVIE_CUT_FOLDER_MAP,
    PHOTO_TYPES, DEFAULT_POSTER_FILENAME, DEFAULT_BANNER_FILENAME,
)

# Import media library and URL builders
from apps.core.utils.media_library import MediaLibrary
from config.media_config import (
    build_audio_url, build_movie_url, build_photo_url,
    build_video_cut_url, build_video_url, build_root_file_url,
)


def get_movie_video_song_folder(movie_title):
    """Get Video Songs folder name for a movie title."""
    return VIDEO_SONG_FOLDER_MAP.get(movie_title, movie_title)


def get_movie_cut_folder(movie_title):
    """Get Movie Cuts folder name for a movie title."""
    return MOVIE_CUT_FOLDER_MAP.get(movie_title, movie_title)


def beautify_title(filename):
    """Convert a filename to a human-readable title."""
    name = filename.rsplit('.', 1)[0]  # Remove extension
    # Remove leading track numbers and separators
    name = re.sub(r'^[\d\s._-]+', '', name)
    # Replace underscores/hyphens with spaces
    name = name.replace('_', ' ').replace('-', ' ')
    # Clean up multiple spaces
    name = re.sub(r'\s+', ' ', name).strip()
    return name.title()


def find_movie_file(title, movie_files):
    """Find the movie filename in the list that matches the movie title."""
    # Normalize: remove extra spaces around dots, make lowercase
    title_normalized = title.lower().replace('. ', '.').replace(' .', '.')
    for fname in movie_files:
        fname_lower = fname.lower()
        # Check normalized versions
        fname_normalized = fname_lower.replace('. ', '.').replace(' .', '.')
        if (fname_lower.startswith(title.lower()) or
            title.lower() in fname_lower or
            title_normalized in fname_normalized):
            if fname_lower.endswith(('.mkv', '.mp4', '.avi', '.mov', '.webm')):
                return fname
    return None


def main():
    print("=" * 60)
    print("NTR Filmography - Seed Script (media-library.json powered)")
    print("=" * 60)

    # Step 0: Load MediaLibrary
    print("\n--- Loading Media Library ---")
    data = MediaLibrary.load()
    if not data:
        print("  ERROR: media-library.json could not be loaded!")
        return
    total_files = MediaLibrary._count_files(data)
    print(f"  Loaded library: {total_files} files across {len(data)} categories")

    # Step 1: Clear existing data
    print("\n--- Clearing existing data ---")
    Photo.objects.all().delete()
    PhotoFolder.objects.all().delete()
    Video.objects.all().delete()
    AudioSong.objects.all().delete()
    Movie.objects.all().delete()
    print("  All existing data cleared.")

    # Step 2: Create Movies
    print("\n--- Creating Movies ---")
    movie_map = {}
    movie_files = MediaLibrary.get_movie_files()
    print(f"  Found {len(movie_files)} movie files in media library")

    poster_url = build_root_file_url(DEFAULT_POSTER_FILENAME)
    banner_url = build_root_file_url(DEFAULT_BANNER_FILENAME)

    for movie_data in MOVIES:
        movie_filename = find_movie_file(movie_data['title'], movie_files)
        movie_url = build_movie_url(movie_filename) if movie_filename else None

        movie, created = Movie.objects.update_or_create(
            title=movie_data['title'],
            defaults={
                'release_year': movie_data['release_year'],
                'description': movie_data['description'],
                'genre': movie_data['genre'],
                'director': movie_data['director'],
                'duration_minutes': movie_data['duration_minutes'],
                'box_office': movie_data['box_office'],
                'poster_url': poster_url,
                'banner_url': banner_url,
                'movie_url': movie_url,
            }
        )
        movie_map[movie_data['title']] = movie
        status = "Created" if created else "Updated"
        has_movie = " (movie file found)" if movie_filename else " (NO movie file)"
        print(f"  {status}: {movie.title} ({movie.release_year}){has_movie}")

    print(f"\n  Total Movies: {Movie.objects.count()}")

    # Step 3: Create Audio Songs
    print("\n--- Creating Audio Songs ---")
    total_audio = 0
    for movie_data in MOVIES:
        movie = movie_map[movie_data['title']]
        r2_folder = movie_data['r2_folder']
        audio_files = MediaLibrary.get_audio_files(r2_folder)

        if not audio_files:
            continue

        songs_created = 0
        for i, filename in enumerate(audio_files, 1):
            audio_url = build_audio_url(r2_folder, filename)
            title = beautify_title(filename)

            AudioSong.objects.create(
                movie=movie,
                title=title,
                artist='Various Artists',
                music_director='',
                audio_url=audio_url,
                duration_seconds=180,
                track_number=i,
                plays=0,
                description=f'Audio track from {movie_data["title"]}',
            )
            songs_created += 1
            total_audio += 1

        if songs_created > 0:
            print(f"  {movie_data['title']}: {songs_created} audio songs")

    print(f"\n  Total Audio Songs: {total_audio}")

    # Step 4: Create Video Songs & Movie Cuts
    print("\n--- Creating Video Songs & Movie Cuts ---")
    total_videos = 0

    # Video Songs
    for folder in MediaLibrary.get_all_video_cut_folders('Video Songs'):
        vc_files = MediaLibrary.get_video_cut_files('Video Songs', folder)
        if vc_files:
            found = 0
            for filename in vc_files:
                video_url = build_video_cut_url('Video Songs', folder, filename)
                title = beautify_title(filename)

                # Attempt to link to a movie if the folder matches
                movie = None
                clean_folder = folder.rstrip('_')
                for m_title, m_obj in movie_map.items():
                    if slugify(m_title) == slugify(clean_folder):
                        movie = m_obj
                        break

                Video.objects.create(
                    movie=movie,
                    title=title,
                    video_type='song',
                    folder_name=folder,
                    video_url=video_url,
                    thumbnail_url=video_url,
                    duration_seconds=240,
                    views=0,
                    description=f'Video song from {folder}',
                )
                found += 1
                total_videos += 1

            print(f"  Video Songs - {folder}: {found} songs")

    # Movie Cuts
    for folder in MediaLibrary.get_all_video_cut_folders('Movie Cuts'):
        mc_files = MediaLibrary.get_video_cut_files('Movie Cuts', folder)
        if mc_files:
            found = 0
            for filename in mc_files:
                video_url = build_video_cut_url('Movie Cuts', folder, filename)
                title = beautify_title(filename)

                # Attempt to link to a movie if the folder matches
                movie = None
                clean_folder = folder.rstrip('_')
                for m_title, m_obj in movie_map.items():
                    if slugify(m_title) == slugify(clean_folder):
                        movie = m_obj
                        break

                Video.objects.create(
                    movie=movie,
                    title=title,
                    video_type='cut',
                    folder_name=folder,
                    video_url=video_url,
                    thumbnail_url=video_url,
                    duration_seconds=180,
                    views=0,
                    description=f'Video cut from {folder}',
                )
                found += 1
                total_videos += 1

            print(f"  Movie Cuts - {folder}: {found} cuts")

    print(f"\n  Total Videos (Songs + Cuts): {total_videos}")

    # Step 5: Create Photo Folders and Photos
    print("\n--- Creating Photo Galleries ---")
    total_photos = 0
    folder_cache = {}

    for path_parts, files in MediaLibrary.walk_photo_folders():
        if not files:
            continue

        # Determine folder_type from first path segment
        first_seg = path_parts[0] if path_parts else ''
        folder_type = PHOTO_TYPES.get(first_seg, 'event')

        # Build the folder hierarchy incrementally
        parent = None
        current_path = ''
        for i, part in enumerate(path_parts):
            if i == 0:
                current_path = part
            else:
                current_path += '/' + part

            if current_path not in folder_cache:
                # For movie type, try to associate with a Movie object
                movie = None
                if folder_type == 'movie' and i == 1:
                    folder_name = part
                    # Look up reverse MOVIE_PHOTO_FOLDER_MAP
                    for m_title, m_folder in MOVIE_PHOTO_FOLDER_MAP.items():
                        if m_folder == folder_name:
                            movie = movie_map.get(m_title)
                            break
                    if movie is None:
                        movie = movie_map.get(folder_name)

                new_folder = PhotoFolder.objects.create(
                    name=part,
                    slug=slugify(current_path.replace('/', '-')),
                    folder_type=folder_type,
                    path=current_path,
                    movie=movie,
                    description=f'{folder_type.title()} photos: {part}',
                    parent_folder=parent,
                )
                folder_cache[current_path] = new_folder
            parent = folder_cache[current_path]

        # Create photo records in the deepest folder
        target_folder = parent
        if target_folder is None:
            continue
            
        for i, filename in enumerate(files, 1):
            image_url = build_photo_url(*path_parts, filename=filename)
            Photo.objects.create(
                folder=target_folder,
                image_url=image_url,
                thumbnail_url=image_url,
                caption=f'{target_folder.name} - Photo {i}',
                order=i,
            )
            total_photos += 1

        if files:
            print(f"  Photos - {'/'.join(path_parts)}: {len(files)} photos")

    print(f"\n  Total Photos: {total_photos}")
    print(f"  Total Photo Folders: {PhotoFolder.objects.count()}")

    # Step 6: Create Event/Celebration Videos
    print("\n--- Creating Event & Celebration Videos ---")
    total_event_videos = 0

    VIDEO_CATEGORY_MAP = {
        'Celebrations': 'celebration',
        'Events': 'event',
    }

    for category, folder_name, files in MediaLibrary.walk_video_categories():
        video_type = VIDEO_CATEGORY_MAP.get(category, 'event')

        found = 0
        for filename in files:
            video_url = build_video_url(category, folder_name, filename)
            title = beautify_title(filename)

            # Use the top-level folder for display
            display_folder = folder_name.split('/')[0]

            Video.objects.create(
                movie=None,
                title=title,
                video_type=video_type,
                video_category=category,
                folder_name=display_folder,
                video_url=video_url,
                thumbnail_url=video_url,
                duration_seconds=180,
                views=0,
                description=f'{video_type.title()} video: {display_folder}',
            )
            found += 1
            total_event_videos += 1

        if found > 0:
            print(f"  {category} Videos - {folder_name}: {found} videos")

    print(f"\n  Total Event/Celebration Videos: {total_event_videos}")

    # Summary
    print("\n" + "=" * 60)
    print("SEED COMPLETE - SUMMARY")
    print("=" * 60)
    print(f"  Movies:              {Movie.objects.count()}")
    print(f"  Audio Songs:         {AudioSong.objects.count()}")
    print(f"  Videos:              {Video.objects.count()}")
    print(f"  Photo Folders:       {PhotoFolder.objects.count()}")
    print(f"  Photos:              {Photo.objects.count()}")
    print("=" * 60)


if __name__ == '__main__':
    main()
