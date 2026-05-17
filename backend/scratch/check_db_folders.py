import os
import sys
import django

# Set up Django environment
sys.path.append(r'c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.videos.models import Video
from django.db.models import Count

print("Checking Video Cuts folders in DB...")
qs = Video.objects.filter(video_type='cut').values('folder_name').annotate(count=Count('id')).order_by('folder_name')
for r in qs:
    print(f"Folder: {r['folder_name']}, Count: {r['count']}")

print("\nChecking all unique folder_names for 'cut' type:")
all_folders = Video.objects.filter(video_type='cut').values_list('folder_name', flat=True).distinct()
print(list(all_folders))
