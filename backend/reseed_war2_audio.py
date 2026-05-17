#!/usr/bin/env python
"""
Reseed War 2 audio songs from media-library.json
"""
import os
import sys
import re
import django

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, PROJECT_ROOT)
django.setup()

from apps.movies.models import Movie
from apps.audio.models import AudioSong
from apps.core.utils.media_library import MediaLibrary
from config.media_config import build_audio_url

def beautify_title(filename):
    """Convert a filename to a human-readable title."""
    name = filename.rsplit('.', 1)[0]  # Remove extension
    name = re.sub(r'^[\d\s._-]+', '', name)
    name = name.replace('_', ' ').replace('-', ' ')
    name = re.sub(r'\s+', ' ', name).strip()
    return name.title()

def main():
    # Load media library
    data = MediaLibrary.load()
    
    # Get War 2 movie
    war2 = Movie.objects.get(slug='war-2')
    print(f"Seeding audio for: {war2.title}")
    
    # Clear existing audio songs for War 2
    AudioSong.objects.filter(movie=war2).delete()
    print(f"Cleared existing songs for {war2.title}")
    
    # Get audio files for War 2 from media library
    r2_folder = 'War 2'
    audio_files = MediaLibrary.get_audio_files(r2_folder)
    
    print(f"Found {len(audio_files)} audio files in R2 folder: {r2_folder}")
    print(f"Files: {audio_files}")
    
    # Create audio songs
    for i, filename in enumerate(audio_files, 1):
        audio_url = build_audio_url(r2_folder, filename)
        title = beautify_title(filename)
        
        song = AudioSong.objects.create(
            movie=war2,
            title=title,
            artist='Various Artists',
            music_director='A. R. Rahman',
            audio_url=audio_url,
            duration_seconds=180,
            track_number=i,
            plays=0,
            description=f'Audio track from {war2.title}',
        )
        print(f"  {i}. {title} - {audio_url}")
    
    print(f"\nTotal Audio Songs created for {war2.title}: {war2.audio_songs.count()}")

if __name__ == '__main__':
    main()
