import os
import sys
import django
from django.utils.text import slugify

# Set up Django environment
PROJECT_ROOT = os.getcwd()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, PROJECT_ROOT)
django.setup()

from apps.movies.models import Movie
from apps.videos.models import Video
from apps.core.utils.media_library import MediaLibrary
from config.media_config import build_video_cut_url

def main():
    print("--- Movie Cuts Diagnostic Seed ---")
    
    # 1. Load Data
    data = MediaLibrary.load()
    if not data:
        print("ERROR: Could not load JSON data")
        return
        
    vc = data.get('VideoCuts', {})
    mc = vc.get('Movie Cuts', {})
    
    all_folders = [k for k in mc.keys() if k not in ['files', '_files']]
    print(f"JSON contains {len(all_folders)} folders in Movie Cuts:")
    for f in sorted(all_folders):
        print(f"  - {f}")

    # 2. Check Database
    existing_cuts = Video.objects.filter(video_type='cut')
    print(f"\nDatabase currently contains {existing_cuts.count()} 'cut' records.")
    
    db_folders = existing_cuts.values_list('folder_name', flat=True).distinct()
    print(f"Database currently contains {len(db_folders)} unique folders:")
    for f in sorted(db_folders):
        print(f"  - {f}")

    # 3. Force Re-seed for missing folders
    print("\n--- Re-seeding Missing Folders ---")
    
    movie_map = {m.title: m for m in Movie.objects.all()}
    
    for folder in all_folders:
        if folder not in db_folders:
            print(f"Processing missing folder: {folder}")
            files = mc[folder].get('files', [])
            if not files:
                print(f"  WARNING: No files found in JSON for {folder}")
                continue
                
            # Attempt linkage
            movie = None
            for m_title, m_obj in movie_map.items():
                if slugify(m_title) == slugify(folder.rstrip('_')):
                    movie = m_obj
                    break
            
            count = 0
            for filename in files:
                if not any(filename.lower().endswith(ext) for ext in ['.mp4', '.mkv', '.webm', '.mov']):
                    continue
                    
                Video.objects.create(
                    movie=movie,
                    title=filename.rsplit('.', 1)[0].replace('_', ' ').title(),
                    video_type='cut',
                    folder_name=folder,
                    video_url=build_video_cut_url('Movie Cuts', folder, filename),
                    thumbnail_url=build_video_cut_url('Movie Cuts', folder, filename),
                    duration_seconds=180,
                    views=0,
                    description=f'Video cut from {folder}',
                )
                count += 1
            print(f"  Created {count} records for {folder}")

    print("\nDiagnostic complete.")

if __name__ == "__main__":
    main()
