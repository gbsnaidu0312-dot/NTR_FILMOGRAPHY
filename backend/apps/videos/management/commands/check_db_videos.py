from django.core.management.base import BaseCommand
from apps.videos.models import Video
from django.db.models import Count

class Command(BaseCommand):
    help = 'Check video folder counts'

    def handle(self, *args, **options):
        self.stdout.write("--- Video Folder Counts ---")
        types = ['cut', 'song', 'event', 'celebration']
        for t in types:
            self.stdout.write(f"\nType: {t}")
            folders = Video.objects.filter(video_type=t).values('folder_name').annotate(count=Count('id')).order_by('folder_name')
            self.stdout.write(f"Found {len(folders)} folders")
            for f in folders:
                self.stdout.write(f"  - {f['folder_name']}: {f['count']} videos")
