import os
import sys
import django

sys.path.append(r"c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\backend")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.movies.models import Movie

print("Adding War 2 to the database...")

war2, created = Movie.objects.get_or_create(
    title='War 2',
    defaults={
        'release_year': 2025,
        'description': 'An upcoming high-octane spy thriller featuring an epic face-off.',
        'genre': 'Action, Thriller, Spy',
        'director': 'Ayan Mukerji',
        'movie_url': 'https://ntrfilmography.live/Movies/War%202%20(2025).mp4',
        'banner_url': 'https://ntrfilmography.live/THUMBNAILS/WAR2_L.png',
        'poster_url': 'https://ntrfilmography.live/THUMBNAIL_P/WAR2.png',
    }
)

if not created:
    war2.movie_url = 'https://ntrfilmography.live/Movies/War%202%20(2025).mp4'
    war2.banner_url = 'https://ntrfilmography.live/THUMBNAILS/WAR2_L.png'
    war2.poster_url = 'https://ntrfilmography.live/THUMBNAIL_P/WAR2.png'
    war2.save()
    print("War 2 updated.")
else:
    print("War 2 created!")

