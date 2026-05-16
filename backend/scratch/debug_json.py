import os
import sys
import json

# Add backend to path
sys.path.insert(0, os.getcwd())

from apps.core.utils.media_library import MediaLibrary

print("--- MediaLibrary Test ---")
data = MediaLibrary.load()
print(f"Keys in data: {list(data.keys())}")

if 'VideoCuts' in data:
    vc = data['VideoCuts']
    print(f"Keys in VideoCuts: {list(vc.keys())}")
    if 'Movie Cuts' in vc:
        mc = vc['Movie Cuts']
        folders = [k for k in mc.keys() if k not in ['files', '_files']]
        print(f"Found {len(folders)} folders in Movie Cuts:")
        for f in sorted(folders):
            files = mc[f].get('files', [])
            print(f"  - {f} ({len(files)} files)")
    else:
        print("ERROR: 'Movie Cuts' not found in VideoCuts")
else:
    print("ERROR: 'VideoCuts' not found in data")
