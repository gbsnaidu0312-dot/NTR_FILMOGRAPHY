"""
Management command to seed database from Cloudflare R2 bucket content.
Generates records with correct media URLs using:
  - Centralized media config for base paths
  - media-library.json for actual filenames

Usage:
    python manage.py seed_from_r2 [--clear]
"""
import logging
import json
import os
from urllib.parse import quote

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.movies.models import Movie
from apps.videos.models import Video
from apps.audio.models import AudioSong
from apps.photos.models import PhotoFolder, Photo

from config.media_config import (
    MEDIA_BASE_URL,
    build_audio_url,
    build_movie_url,
    build_photo_url,
    build_video_cut_url,
    build_video_url,
)
from apps.core.utils.media_library import MediaLibrary

logger = logging.getLogger(__name__)

# ── Default asset paths ──────────────────────────────────────
DEFAULT_POSTER_PATH = '/wp5283563.jpg'
DEFAULT_BANNER_PATH = '/wp5283563.jpg'


# ── Movie Metadata (r2_folder maps JSON folder names to DB movie titles) ──
MOVIES = [
    {'title': 'Ninnu Choodalani', 'release_year': 2001, 'genre': 'Romance, Drama',
     'director': 'V. R. Pratap', 'duration_minutes': 155,
     'description': 'The debut film of Jr. NTR. A romantic drama where a young man falls in love with a woman he meets, navigating the complexities of love and relationships.',
     'r2_folder': 'Ninnu Choodalani'},
    {'title': 'Student No. 1', 'release_year': 2001, 'genre': 'Drama',
     'director': 'S. S. Rajamouli', 'duration_minutes': 158,
     'description': 'A drama about a student who fights against corruption in the education system.',
     'r2_folder': 'Student No1'},
    {'title': 'Subbu', 'release_year': 2001, 'genre': 'Romance, Comedy',
     'director': 'Rudraraju Suresh Varma', 'duration_minutes': 150,
     'description': 'A romantic comedy where a young man named Subbu navigates love and family expectations.',
     'r2_folder': 'Subbu'},
    {'title': 'Aadi', 'release_year': 2002, 'genre': 'Action, Drama',
     'director': 'V. V. Vinayak', 'duration_minutes': 165,
     'description': 'A young man fights against a powerful criminal to protect his family and loved ones.',
     'r2_folder': 'Aadi'},
    {'title': 'Allari Ramudu', 'release_year': 2002, 'genre': 'Comedy, Drama',
     'director': 'B. Gopal', 'duration_minutes': 150,
     'description': 'A comedic entertainer where a mischievous young man brings joy and chaos to his village.',
     'r2_folder': 'Allari Ramudu'},
    {'title': 'Naaga', 'release_year': 2003, 'genre': 'Action, Drama',
     'director': 'A. M. Ratnam', 'duration_minutes': 155,
     'description': 'An action drama centered around a village headman who fights against oppression and injustice.',
     'r2_folder': 'Naaga'},
    {'title': 'Simhadri', 'release_year': 2003, 'genre': 'Action, Drama',
     'director': 'S. S. Rajamouli', 'duration_minutes': 165,
     'description': 'A village headman sacrifices his life to avenge injustice. The film that established Jr. NTR as a mass action hero.',
     'r2_folder': 'Simhadri'},
    {'title': 'Andhrawala', 'release_year': 2004, 'genre': 'Action',
     'director': 'Puri Jagannadh', 'duration_minutes': 158,
     'description': 'A high-octane action film about a man seeking revenge for his family massacre.',
     'r2_folder': 'Andhrawala'},
    {'title': 'Samba', 'release_year': 2004, 'genre': 'Action, Comedy',
     'director': 'V. V. Vinayak', 'duration_minutes': 155,
     'description': 'An action comedy about a fisherman who gets entangled in political rivalry.',
     'r2_folder': 'Samba'},
    {'title': 'Naa Alludu', 'release_year': 2005, 'genre': 'Comedy, Romance',
     'director': 'B. Gopal', 'duration_minutes': 150,
     'description': 'A comedy entertainer about an young man who becomes someone else to win his beloved.',
     'r2_folder': 'Naa Alludu'},
    {'title': 'Narasimhudu', 'release_year': 2005, 'genre': 'Action',
     'director': 'B. Gopal', 'duration_minutes': 155,
     'description': 'A powerful man takes on the corrupt system to protect the innocent.',
     'r2_folder': 'Narasimhudu'},
    {'title': 'Ashok', 'release_year': 2006, 'genre': 'Action, Romance',
     'director': 'Surender Reddy', 'duration_minutes': 160,
     'description': 'A software engineer falls in love and fights against a dangerous criminal.',
     'r2_folder': 'Ashok'},
    {'title': 'Rakhi', 'release_year': 2006, 'genre': 'Drama, Family',
     'director': 'Krishna Vamsi', 'duration_minutes': 165,
     'description': 'A brother goes to great lengths to protect his sister and fulfill their dreams.',
     'r2_folder': 'Rakhi'},
    {'title': 'Yamadonga', 'release_year': 2007, 'genre': 'Fantasy, Action, Comedy',
     'director': 'S. S. Rajamouli', 'duration_minutes': 168,
     'description': 'A thief dies and goes to Yamalokam, challenging the god of death himself.',
     'r2_folder': 'YamaDonga'},
    {'title': 'Kantri', 'release_year': 2008, 'genre': 'Action',
     'director': 'Meher Ramesh', 'duration_minutes': 155,
     'description': 'A stylish action film about a gangster with a heart of gold.',
     'r2_folder': 'Kantri'},
    {'title': 'Adhurs', 'release_year': 2010, 'genre': 'Action, Comedy',
     'director': 'V. V. Vinayak', 'duration_minutes': 162,
     'description': 'Jr. NTR plays a dual role - a priest and a gangster.',
     'r2_folder': 'Adhurs'},
    {'title': 'Brindavanam', 'release_year': 2010, 'genre': 'Romance, Action, Drama',
     'director': 'Vamsi Paidipally', 'duration_minutes': 170,
     'description': 'A young man pretends to be a lover to help a family, only to find real love.',
     'r2_folder': 'Brindavanam'},
    {'title': 'Shakti', 'release_year': 2011, 'genre': 'Action, Drama',
     'director': 'Meher Ramesh', 'duration_minutes': 158,
     'description': 'A powerful family feud and a man caught between love and duty.',
     'r2_folder': 'Shakti'},
    {'title': 'Oosaravelli', 'release_year': 2011, 'genre': 'Action, Thriller',
     'director': 'Surender Reddy', 'duration_minutes': 155,
     'description': 'A man uses unique skills to take revenge on those who wronged his family.',
     'r2_folder': 'Oosaravelli'},
    {'title': 'Dhammu', 'release_year': 2012, 'genre': 'Action, Drama',
     'director': 'Boyapati Srinu', 'duration_minutes': 160,
     'description': 'A fierce warrior fights against a powerful antagonist to protect his people.',
     'r2_folder': 'Dhammu'},
    {'title': 'Baadshah', 'release_year': 2013, 'genre': 'Action, Comedy',
     'director': 'Srinu Vaitla', 'duration_minutes': 165,
     'description': 'A carefree young man becomes a powerful don.',
     'r2_folder': 'Baadshah'},
    {'title': 'Ramayya Vasthavayya', 'release_year': 2013, 'genre': 'Action, Romance, Drama',
     'director': 'Harish Shankar', 'duration_minutes': 160,
     'description': 'A young man falls in love and faces challenges from his past.',
     'r2_folder': 'Ramayya Vastavayya'},
    {'title': 'Rabhasa', 'release_year': 2014, 'genre': 'Action, Drama',
     'director': 'Santosh Srinivas', 'duration_minutes': 155,
     'description': 'A fearless young man takes on a powerful gang to protect his family and love.',
     'r2_folder': 'Rabhasa'},
    {'title': 'Temper', 'release_year': 2015, 'genre': 'Action, Drama, Thriller',
     'director': 'Puri Jagannadh', 'duration_minutes': 158,
     'description': 'A suspended police officer fights against corruption and injustice.',
     'r2_folder': 'Temper'},
    {'title': 'Nannaku Prematho', 'release_year': 2016, 'genre': 'Action, Drama, Family',
     'director': 'Sukumar', 'duration_minutes': 165,
     'description': 'A son fights against a corporate giant to fulfill his fathers dream.',
     'r2_folder': 'Nannaku Prematho'},
    {'title': 'Janatha Garage', 'release_year': 2016, 'genre': 'Action, Drama',
     'director': 'Koratala Siva', 'duration_minutes': 162,
     'description': 'A mechanic runs a garage that serves as a front for helping the oppressed.',
     'r2_folder': 'Janatha Garage'},
    {'title': 'Jai Lava Kusa', 'release_year': 2017, 'genre': 'Action, Drama',
     'director': 'K. S. Ravindra', 'duration_minutes': 170,
     'description': 'Jr. NTR plays a triple role in this action drama about three brothers.',
     'r2_folder': 'Jai Lava Kusa'},
    {'title': 'Aravinda Sametha', 'release_year': 2018, 'genre': 'Action, Drama',
     'director': 'Trivikram Srinivas', 'duration_minutes': 168,
     'description': 'A powerful action drama about caste-based violence in Rayalaseema.',
     'r2_folder': 'Aravinda Sametha'},
    {'title': 'RRR', 'release_year': 2022, 'genre': 'Action, Drama, Period',
     'director': 'S. S. Rajamouli', 'duration_minutes': 187,
     'description': 'An epic period action drama about Indian revolutionaries in the 1920s. Academy Award winner.',
     'r2_folder': 'RRR'},
    {'title': 'Devara', 'release_year': 2024, 'genre': 'Action, Drama',
     'director': 'Koratala Siva', 'duration_minutes': 180,
     'description': 'A high-octane action drama set in a coastal village. Part 1 of an epic saga.',
     'r2_folder': 'Devara'},
]

# Photo folder name overrides (some photos folders differ from r2_folder)
PHOTO_MOVIE_FOLDER_MAP = {
    'Brindavanam': 'Brindaavanam',
    'Kantri': 'kantri',
    'Yamadonga': 'YamaDonga',
    'Student No. 1': 'Student No1',
}

# Extra photo movie folders (non-NTR films, design edits, upcoming)
EXTRA_PHOTO_MOVIE_FOLDERS = [
    'AI', 'Bala Ramayanam', 'Bhaktha Markandeya', 'Brahmarshi Vishwamitra',
    'Chintakayala Ravi', 'Design Edits', 'NTR-NEEL', 'Title PNG_s', 'War2',
]

# Photo event folders
EVENT_PHOTO_FOLDER_NAMES = [
    'ADDS', 'AWARDS', 'Childhood Pics', 'DEMISE', 'FAMILY',
    'MOVIE EVENTS_', 'NTR Clicks', 'NTR MOVIE EVENTS(audio, muhurtham ,pre-release)',
    'OTHER EVENTS', 'POLITICS',
]


def get_photo_movie_folder(movie_title):
    """Get the photo folder name for a movie (may differ from r2_folder)."""
    return PHOTO_MOVIE_FOLDER_MAP.get(movie_title, None)


def strip_extension(filename):
    """Remove file extension from filename for use as title."""
    name, _ = os.path.splitext(filename)
    return name.strip()


class Command(BaseCommand):
    help = 'Seed the database with correct media URLs from media-library.json'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before seeding')

    def handle(self, *args, **options):
        do_clear = options['clear']

        self.stdout.write('=' * 60)
        self.stdout.write(self.style.NOTICE('NTR Filmography - R2 Seed Script'))
        self.stdout.write(self.style.NOTICE(f'Base URL: {MEDIA_BASE_URL}'))
        self.stdout.write('=' * 60)

        # Load media library
        MediaLibrary.load()
        total_files = MediaLibrary._count_files(MediaLibrary._data)
        self.stdout.write(f'Media library loaded: {total_files} files catalogued\n')

        # Step 0: Clear data if requested
        if do_clear:
            self.stdout.write('\n--- Clearing existing data ---')
            Photo.objects.all().delete()
            PhotoFolder.objects.all().delete()
            Video.objects.all().delete()
            AudioSong.objects.all().delete()
            Movie.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('  All existing data cleared.\n'))

        # Step 1: Create Movies
        self._create_movies()

        # Step 2: Create Audio Songs (from JSON actual filenames)
        self._create_audio_songs()

        # Step 3: Create Videos (cuts and songs from JSON)
        self._create_video_cuts()

        # Step 4: Create Photos (walk JSON hierarchy)
        self._create_photo_galleries()

        # Step 5: Create Event/Celebration/Ads Videos
        self._create_event_videos()

        # Summary
        self._print_summary()

    # ── Step 1: Movies ──────────────────────────────────────

    def _create_movies(self):
        self.stdout.write('\n--- Creating Movies ---')
        self.movie_map = {}
        self.movie_by_r2_folder = {}

        # Get actual movie filenames from JSON
        movie_files = MediaLibrary.get_movie_files()
        movie_file_map = {}  # lower(title) -> filename
        for mf in movie_files:
            # Parse "Aadi (2002).mkv" -> title_part = "Aadi"
            name = mf.rsplit('.', 1)[0]  # remove extension
            # Remove year like "(2002)"
            import re
            title_part = re.sub(r'\s*\(\d{4}\)\s*', '', name).strip().lower()
            movie_file_map[title_part] = mf

        for movie_data in MOVIES:
            poster_url = f'{MEDIA_BASE_URL}{DEFAULT_POSTER_PATH}'
            banner_url = f'{MEDIA_BASE_URL}{DEFAULT_BANNER_PATH}'

            # Find actual movie file URL from JSON
            movie_filename = None
            title_lower = movie_data['title'].lower()
            if title_lower in movie_file_map:
                movie_filename = movie_file_map[title_lower]
            else:
                # Try matching by r2_folder
                for key, val in movie_file_map.items():
                    if movie_data['r2_folder'].lower() in key or key in movie_data['r2_folder'].lower():
                        movie_filename = val
                        break

            movie_url = build_movie_url(movie_filename) if movie_filename else None

            movie, created = Movie.objects.update_or_create(
                title=movie_data['title'],
                defaults={
                    'slug': slugify(movie_data['title']),
                    'release_year': movie_data['release_year'],
                    'description': movie_data['description'],
                    'genre': movie_data['genre'],
                    'director': movie_data['director'],
                    'duration_minutes': movie_data['duration_minutes'],
                    'poster_url': poster_url,
                    'banner_url': banner_url,
                    'movie_url': movie_url,
                }
            )
            self.movie_map[movie_data['title']] = movie
            self.movie_map[movie_data['title'].lower()] = movie
            self.movie_by_r2_folder[movie_data['r2_folder']] = movie

            status = 'Created' if created else 'Updated'
            movie_info = f'{movie.title} ({movie.release_year})'
            if movie_url:
                movie_info += f' [movie_url set]'
            self.stdout.write(f'  {status}: {movie_info}')

        self.stdout.write(f'\n  Total Movies: {Movie.objects.count()}')

    # ── Step 2: Audio Songs ─────────────────────────────────

    def _create_audio_songs(self):
        """Create audio songs using actual filenames from media-library.json."""
        self.stdout.write('\n--- Creating Audio Songs (from JSON) ---')
        total = 0

        for movie_data in MOVIES:
            folder = movie_data['r2_folder']
            files = MediaLibrary.get_audio_files(folder)

            if not files:
                self.stdout.write(f'  {movie_data["title"]}: no audio files found in JSON')
                continue

            movie = self.movie_map.get(movie_data['title'])
            if not movie:
                continue

            songs_created = 0
            for i, filename in enumerate(files, start=1):
                # Build correct URL using actual filename
                url = build_audio_url(folder, filename)
                # Use filename without extension as the song title
                title = strip_extension(filename)

                AudioSong.objects.create(
                    movie=movie,
                    title=title,
                    artist='',
                    audio_url=url,
                    duration_seconds=240,
                    track_number=i,
                    plays=0,
                    description=f'Audio track from {movie_data["title"]}',
                )
                songs_created += 1
                total += 1

            self.stdout.write(f'  {movie_data["title"]}: {songs_created} audio songs')

        self.stdout.write(f'\n  Total Audio Songs: {total}')

    # ── Step 3: Video Cuts & Songs ──────────────────────────

    def _create_video_cuts(self):
        """Create video songs and movie cuts from JSON."""
        self.stdout.write('\n--- Creating Video Songs & Movie Cuts (from JSON) ---')
        total = 0

        # ── Video Songs ──
        self.stdout.write('  --- Video Songs ---')
        for movie_data in MOVIES:
            folder = movie_data['r2_folder']
            movie = self.movie_map.get(movie_data['title'])
            if not movie:
                continue

            # Get files from "Video Songs" section
            files = MediaLibrary.get_video_cut_files('Video Songs', folder)
            if not files:
                continue

            found = 0
            for filename in files:
                url = build_video_cut_url('Video Songs', folder, filename)
                title = strip_extension(filename)

                Video.objects.create(
                    movie=movie,
                    title=f'{movie_data["title"]} - {title}',
                    video_type='song',
                    video_url=url,
                    thumbnail_url=url,
                    duration_seconds=240,
                    views=0,
                    description=f'Video song from {movie_data["title"]}',
                )
                found += 1
                total += 1

            if found:
                self.stdout.write(f'    {movie_data["title"]}: {found} video songs')

        # ── Movie Cuts ──
        self.stdout.write('  --- Movie Cuts ---')
        for movie_data in MOVIES:
            folder = movie_data['r2_folder']
            movie = self.movie_map.get(movie_data['title'])
            if not movie:
                continue

            # Check for "Movie Cuts" section - folder may have "_" suffix in some cases
            files = MediaLibrary.get_video_cut_files('Movie Cuts', folder)

            # Also try with underscore suffix
            if not files:
                files = MediaLibrary.get_video_cut_files('Movie Cuts', f'{folder}_')

            if not files:
                continue

            found = 0
            for filename in files:
                # Determine correct folder name (with or without underscore)
                actual_folder = folder
                if not MediaLibrary.get_video_cut_files('Movie Cuts', folder):
                    # Check if folder with _ exists
                    if MediaLibrary.get_video_cut_files('Movie Cuts', f'{folder}_'):
                        actual_folder = f'{folder}_'

                url = build_video_cut_url('Movie Cuts', actual_folder, filename)
                title = strip_extension(filename)

                Video.objects.create(
                    movie=movie,
                    title=f'{movie_data["title"]} - {title}',
                    video_type='cut',
                    video_url=url,
                    thumbnail_url=url,
                    duration_seconds=180,
                    views=0,
                    description=f'Video cut from {movie_data["title"]}',
                )
                found += 1
                total += 1

            if found:
                self.stdout.write(f'    {movie_data["title"]}: {found} movie cuts')

        self.stdout.write(f'\n  Total Video Songs & Cuts: {total}')

    # ── Step 4: Photos ──────────────────────────────────────

    def _create_photo_galleries(self):
        """Create photo folders and photo records by walking JSON hierarchy."""
        self.stdout.write('\n--- Creating Photo Galleries (from JSON) ---')
        total_photos = 0
        self.photo_folder_cache = {}  # path -> PhotoFolder instance

        def get_or_create_photo_folder(path_parts, folder_type='movie', movie=None):
            """Get or create a PhotoFolder by its full path hierarchy."""
            path_str = '/'.join(path_parts)
            if path_str in self.photo_folder_cache:
                return self.photo_folder_cache[path_str]

            name = path_parts[-1]
            parent = None
            if len(path_parts) > 1:
                parent = get_or_create_photo_folder(path_parts[:-1], folder_type, movie)

            # Create unique slug
            slug_base = slugify(f'{folder_type}-{path_str}')
            slug = slug_base

            pf, created = PhotoFolder.objects.get_or_create(
                name=name,
                path=path_str,
                folder_type=folder_type,
                defaults={
                    'slug': slug,
                    'movie': movie,
                    'parent_folder': parent,
                    'description': f'{folder_type.capitalize()} photos: {path_str}',
                }
            )
            self.photo_folder_cache[path_str] = pf
            return pf

        # Walk entire Photos hierarchy from JSON
        for path_parts, files in MediaLibrary.walk_photo_folders():
            if not files:
                continue

            # Determine folder type and movie association
            folder_type = 'movie'  # default
            movie = None

            if path_parts and path_parts[0] == 'Event':
                folder_type = 'event'
            elif path_parts and path_parts[0] == 'Offline':
                folder_type = 'offline'
            elif path_parts and path_parts[0] == 'Movie':
                folder_type = 'movie'
                # Try to find associated movie
                if len(path_parts) > 1:
                    folder_name = path_parts[1]
                    # Remove trailing underscores sometimes used in photo folders
                    clean_name = folder_name.rstrip('_')
                    # Look up by r2_folder mapping
                    for md in MOVIES:
                        r2 = get_photo_movie_folder(md['title']) or md['r2_folder']
                        if r2.lower() == folder_name.lower() or clean_name.lower() in md['title'].lower() or md['title'].lower() in clean_name.lower():
                            movie = self.movie_map.get(md['title'])
                            break

                    # Also check EXTRA_PHOTO_MOVIE_FOLDERS
                    if not movie:
                        for extra in EXTRA_PHOTO_MOVIE_FOLDERS:
                            if extra.lower() == folder_name.lower() or extra.lower() == clean_name.lower():
                                break

            try:
                pf = get_or_create_photo_folder(path_parts, folder_type, movie)
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'  Error creating folder {" > ".join(path_parts)}: {e}'))
                continue

            # Create photo records
            photos_in_folder = 0
            for filename in files:
                # Build URL using all path parts + filename
                url = build_photo_url(*path_parts, filename=filename)

                Photo.objects.create(
                    folder=pf,
                    image_url=url,
                    thumbnail_url=url,
                    caption=strip_extension(filename),
                    order=photos_in_folder + 1,
                )
                photos_in_folder += 1
                total_photos += 1

            if photos_in_folder > 0:
                self.stdout.write(f'  Photos {" > ".join(path_parts)}: {photos_in_folder} photos')

        # Also create Movie photo folders for movies that don't have JSON entries (fallback)
        for movie_data in MOVIES:
            movie = self.movie_map.get(movie_data['title'])
            if not movie:
                continue

            photo_folder_name = get_photo_movie_folder(movie_data['title']) or movie_data['r2_folder']
            path_parts = ['Movie', photo_folder_name]
            path_str = '/'.join(path_parts)

            if path_str not in self.photo_folder_cache:
                # Check if JSON has this folder
                json_files = MediaLibrary.get_photo_files(path_parts)
                if not json_files:
                    continue
            else:
                continue  # already created from walk

        self.stdout.write(f'\n  Total Photos: {total_photos}')

    # ── Step 5: Event/Celebration Videos ────────────────────

    def _create_event_videos(self):
        """Create event, celebration, ads, and interview videos from JSON."""
        self.stdout.write('\n--- Creating Event, Celebration, & Other Videos (from JSON) ---')
        total = 0

        # Walk all Videos categories from JSON
        for category, folder_name, files in MediaLibrary.walk_video_categories():
            if not files:
                continue

            # Map category to video_type
            video_type_map = {
                'Celebrations': 'celebration',
                'Events': 'event',
            }
            video_type = video_type_map.get(category, 'event')

            found = 0
            for filename in files:
                # Handle nested folder paths (e.g., "Ntr Interviews/Nannaku Prematho_")
                if '/' in folder_name:
                    parts = folder_name.split('/')
                    actual_folder = parts[0]
                    sub_folder = parts[1]
                    # For nested, use the subfolder name as folder_name
                    display_folder = sub_folder
                    url = build_video_url(category, f'{actual_folder}/{sub_folder}', filename)
                else:
                    display_folder = folder_name
                    url = build_video_url(category, folder_name, filename)

                title = strip_extension(filename)

                Video.objects.create(
                    movie=None,
                    title=f'{display_folder} - {title}',
                    video_type=video_type,
                    video_category=category,
                    video_url=url,
                    thumbnail_url=url,
                    duration_seconds=180,
                    views=0,
                    description=f'{category} video: {display_folder}',
                    folder_name=display_folder,
                )
                found += 1
                total += 1

            if found > 0:
                self.stdout.write(f'  {category} / {folder_name}: {found} videos')

        self.stdout.write(f'\n  Total Event/Celebration/Other Videos: {total}')

    # ── Summary ─────────────────────────────────────────────

    def _print_summary(self):
        self.stdout.write('\n' + '=' * 60)
        self.stdout.write(self.style.SUCCESS('SEED COMPLETE - SUMMARY'))
        self.stdout.write('=' * 60)
        self.stdout.write(f'  Movies:              {Movie.objects.count()}')
        self.stdout.write(f'  Audio Songs:         {AudioSong.objects.count()}')
        self.stdout.write(f'  Videos:              {Video.objects.count()}')
        self.stdout.write(f'  Photo Folders:       {PhotoFolder.objects.count()}')
        self.stdout.write(f'  Photos:              {Photo.objects.count()}')
        self.stdout.write('=' * 60)
        self.stdout.write(f'\nAll URLs use base: {MEDIA_BASE_URL}')
        self.stdout.write('Filenames sourced from media-library.json (canonical R2 file listing).')
