import sys
import os
import json

# Add backend to path
sys.path.append(r'c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\backend')

# Define paths for MediaLibrary to find the JSON
os.environ['MEDIA_LIBRARY_PATH'] = r'c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\backend\full_media_structure.json'

try:
    # Use direct import since we added backend to path
    from apps.core.utils.media_library import MediaLibrary
    
    print("Checking Movie Cuts folders...")
    folders = MediaLibrary.get_all_video_cut_folders('Movie Cuts')
    print(f"Total folders found: {len(folders)}")
    print(f"Folders: {folders}")
    
    for f in folders:
        files = MediaLibrary.get_video_cut_files('Movie Cuts', f)
        print(f"  Folder: {f}, Files count: {len(files)}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
