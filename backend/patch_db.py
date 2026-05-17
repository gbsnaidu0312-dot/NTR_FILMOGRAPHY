import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from apps.videos.models import Video
import urllib.parse

print("Updating Video Cuts...")
cuts = Video.objects.filter(video_type='cut')
updated_cuts = 0
for v in cuts:
    if v.folder_name is None:
        # Extract folder from URL: https://ntrfilmography.live/VideoCuts/Movie%20Cuts/Devara/Inshot...
        parts = urllib.parse.unquote(v.video_url).split('/')
        try:
            idx = parts.index('Movie Cuts')
            folder = parts[idx+1]
            v.folder_name = folder
            v.save()
            updated_cuts += 1
        except ValueError:
            pass
print(f"Updated {updated_cuts} movie cuts.")

print("Updating Video Songs...")
songs = Video.objects.filter(video_type='song')
updated_songs = 0
for v in songs:
    if v.folder_name is None:
        # Extract folder from URL: https://ntrfilmography.live/VideoCuts/Video%20Songs/Devara/Davudi.mp4
        parts = urllib.parse.unquote(v.video_url).split('/')
        try:
            idx = parts.index('Video Songs')
            folder = parts[idx+1]
            v.folder_name = folder
            v.save()
            updated_songs += 1
        except ValueError:
            pass
print(f"Updated {updated_songs} video songs.")
