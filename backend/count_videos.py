import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from apps.videos.models import Video

print("Total videos:", Video.objects.count())
for vtype in ['cut', 'song', 'event', 'celebration']:
    print(f"Type {vtype}:", Video.objects.filter(video_type=vtype).count())
