import os
import sys
import django

sys.path.append(r"c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\backend")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.movies.models import Movie
from apps.audio.models import AudioSong

print("Adding Audio Songs for War 2...")

try:
    war2 = Movie.objects.get(title='War 2')
    
    songs_data = [
        {'title': 'Shaitan', 'filename': 'Shaitan.mp3'},
        {'title': 'Janaab-e-Aali', 'filename': 'Janaab-e-Aali .mp3'},
        {'title': 'Salam Anali', 'filename': 'Salam Anali .mp3'},
    ]
    
    BASE_URL = 'https://ntrfilmography.live/Audio/War 2/'
    
    for idx, song in enumerate(songs_data, start=1):
        # We replace spaces with %20 in the filename for the URL, but the actual URL needs to be encoded carefully
        # Actually, requests will just use the string. Let's encode spaces.
        encoded_filename = song['filename'].replace(' ', '%20')
        url = f"https://ntrfilmography.live/Audio/War%202/{encoded_filename}"
        
        audio_song, created = AudioSong.objects.get_or_create(
            movie=war2,
            title=song['title'],
            defaults={
                'audio_url': url,
                'artist': 'Anirudh Ravichander', # Assuming Anirudh or unknown
                'duration_seconds': 210, # default 3:30
                'track_number': idx
            }
        )
        
        if not created:
            audio_song.audio_url = url
            audio_song.save()
            print(f"Updated song: {song['title']}")
        else:
            print(f"Created song: {song['title']}")
            
    print("\nDone adding War 2 audio songs!")
    
except Movie.DoesNotExist:
    print("War 2 movie not found in DB!")
