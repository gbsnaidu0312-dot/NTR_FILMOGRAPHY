import os
import sys
import struct
import requests
import django

# Setup Django environment
if '__file__' in globals():
    PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
else:
    PROJECT_ROOT = os.getcwd()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, PROJECT_ROOT)
django.setup()

from apps.videos.models import Video

def get_mp4_duration(url):
    try:
        # Fetch the first 64KB (headers)
        headers = {'Range': 'bytes=0-65536'}
        r = requests.get(url, headers=headers, timeout=5)
        data = r.content
        
        # Search for 'mvhd' atom (movie header)
        idx = data.find(b'mvhd')
        if idx == -1:
            # Try first 512KB if 'mvhd' is a bit deeper in the file
            headers = {'Range': 'bytes=0-524288'}
            r = requests.get(url, headers=headers, timeout=5)
            data = r.content
            idx = data.find(b'mvhd')
            if idx == -1:
                return None
        
        version = data[idx + 8]
        if version == 0:
            timescale = struct.unpack('>I', data[idx + 20:idx + 24])[0]
            duration = struct.unpack('>I', data[idx + 24:idx + 28])[0]
        elif version == 1:
            timescale = struct.unpack('>I', data[idx + 28:idx + 32])[0]
            duration = struct.unpack('>Q', data[idx + 32:idx + 40])[0]
        else:
            return None
            
        if timescale > 0:
            return int(duration / timescale)
    except Exception as e:
        pass
    return None

def main():
    print("=" * 60)
    print("NTR Filmography - Video Durations Patcher")
    print("=" * 60)
    
    videos = Video.objects.all()
    total = videos.count()
    print(f"Found {total} video records in the database.")
    
    updated_count = 0
    skipped_count = 0
    
    for i, video in enumerate(videos, 1):
        print(f"[{i}/{total}] Processing: {video.title} ({video.video_type})")
        url = video.video_url
        
        if not url:
            print("  Skipping: No video URL.")
            skipped_count += 1
            continue
            
        # Parse exact duration from R2
        duration = get_mp4_duration(url)
        if duration:
            video.duration_seconds = duration
            video.save()
            print(f"  --> Updated duration to: {duration} seconds")
            updated_count += 1
        else:
            print("  --> Could not parse duration (non-MP4 or faststart headers missing). Keeping current value.")
            skipped_count += 1
            
    print("=" * 60)
    print("PATCHING COMPLETE - SUMMARY")
    print("=" * 60)
    print(f"  Total processed: {total}")
    print(f"  Updated:         {updated_count}")
    print(f"  Skipped/Kept:    {skipped_count}")
    print("=" * 60)

if __name__ == '__main__':
    main()
