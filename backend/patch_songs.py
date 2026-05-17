import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from apps.videos.models import Video
import urllib.parse

print("Updating Video Songs...")
songs = Video.objects.filter(video_type='song')
updated_songs = 0
for v in songs:
    if not v.folder_name:
        url_unquoted = urllib.parse.unquote(v.video_url)
        parts = url_unquoted.split('/')
        
        folder = None
        if 'Video Songs' in parts:
            idx = parts.index('Video Songs')
            folder = parts[idx+1]
        elif 'VideoCuts' in parts:
            idx = parts.index('VideoCuts')
            if len(parts) > idx + 2:
                folder = parts[idx+2]

        if folder:
            v.folder_name = folder
            v.save()
            updated_songs += 1
        else:
            print(f"Failed for: {v.video_url} -> {parts}")

print(f"Updated {updated_songs} video songs.")
