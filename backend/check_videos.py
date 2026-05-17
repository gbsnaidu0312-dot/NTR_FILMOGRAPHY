import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from apps.videos.models import Video

print("--- SONGS ---")
for v in Video.objects.filter(video_type='song')[:5]:
    print(f"ID: {v.id}, Title: {v.title}, Folder: {v.folder_name}, URL: {v.video_url}")

print("--- CUTS ---")
for v in Video.objects.filter(video_type='cut')[:5]:
    print(f"ID: {v.id}, Title: {v.title}, Folder: {v.folder_name}, URL: {v.video_url}")
