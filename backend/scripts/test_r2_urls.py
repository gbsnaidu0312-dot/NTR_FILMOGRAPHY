"""Quick script to verify R2 URL patterns"""
import requests
import urllib3
urllib3.disable_warnings()

base = 'https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev'

tests = [
    # Movies - verify exact names from bucket
    'Movies/Aadi%20(2002).mkv',
    'Movies/Devara%20(2024).mp4',
    'Movies/Devarapart1%20(2024).mp4',
    'Movies/Aravindha%20Sametha%20(2018).mp4',
    
    # Movie Photos - try single digit (not 01) since 1.jpg worked for RRR
    'Photos/Movie/RRR/1.jpg',
    'Photos/Movie/RRR/2.jpg',
    'Photos/Movie/Aadi/1.jpg',
    'Photos/Movie/Aadi/2.jpg',
    'Photos/Movie/Devara/1.jpg',
    'Photos/Movie/Aravinda%20sametha/1.jpg',
    
    # Event Photos
    'Photos/Event/POLITICS/1.jpg',
    'Photos/Event/POLITICS/2.jpg',
    'Photos/Event/FAMILY/1.jpg',
    'Photos/Event/FAMILY/01.jpg',
    'Photos/Event/ADDS/1.jpg',
    
    # Audio - try numbered, single digit, and descriptive
    'Audio/Aadi/1.mp3',
    'Audio/Aadi/01.mp3',
    'Audio/Aadi/Aadi-01.mp3',
    'Audio/RRR/1.mp3',
    'Audio/RRR/01.mp3',
    'Audio/Devara/1.mp3',
    'Audio/Devara/01.mp3',
    
    # Video Songs
    'VideoCuts/Video%20Songs/Aadi/1.mp4',
    'VideoCuts/Video%20Songs/Aadi/01.mp4',
    'VideoCuts/Video%20Songs/Aadi/song-1.mp4',
    'VideoCuts/Video%20Songs/Aadi/song-01.mp4',
    'VideoCuts/Video%20Songs/Aadi/video-1.mp4',
    
    # Movie Cuts
    'VideoCuts/Movie%20Cuts/Aadi_/1.mp4',
    'VideoCuts/Movie%20Cuts/Aadi_/cut-1.mp4',
    'VideoCuts/Movie%20Cuts/Aadi_/cut-01.mp4',
    
    # Event Videos
    'Videos/Events/Adds/1.mp4',
    'Videos/Events/Adds/video-1.mp4',
    'Videos/Celebrations/17%20Jan%20Celebrations%20Tirupati/1.mp4',
    'Videos/Celebrations/17%20Jan%20Celebrations%20Tirupati/video-1.mp4',
]

print("Testing R2 URL patterns...")
print("=" * 60)
for path in tests:
    url = f'{base}/{path}'
    try:
        r = requests.head(url, verify=False, timeout=5, allow_redirects=True)
        print(f'  {r.status_code:>3}  {path}')
    except Exception as e:
        print(f'  ERR  {path}  ({e})')

print("=" * 60)
print("Done!")
