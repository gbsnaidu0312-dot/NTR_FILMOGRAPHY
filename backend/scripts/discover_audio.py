"""Discover actual audio file names by trying many patterns"""
import requests
import urllib3
urllib3.disable_warnings()
from urllib.parse import quote

base = 'https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev'
folder = 'Audio/Aadi'

# Try many naming patterns for audio files
song_names = [
    'Na Peru Aadi',
    'Naa Peru Aadi',
    'Naa Peru Adhi',
    'Naa Chinni Thalli',
    'Naa Kosam',
    'Nuvvu Nenu',
    'Aadi song 1',
    'Aadi Song 01',
    'Song 1',
    'Song 01',
    '01 - Na Peru Aadi',
    '01-Na Peru Aadi',
    '01 - Song',
]
extensions = ['.mp3']

# Also try generic patterns
generic = []
for i in range(1, 10):
    generic.extend([
        f'{i}',
        f'0{i}',
        f'song {i}',
        f'song-{i}',
        f'song0{i}',
        f'track {i}',
        f'track-{i}',
        f'track0{i}',
        f'{folder.lower()} {i}',
        f'{folder.lower()}-{i}',
    ])
all_names = song_names + generic

print(f"Testing {len(all_names)} patterns for Audio/Aadi/...")
found = []
for name in all_names:
    for ext in extensions:
        filename = f'{name}{ext}'
        url = f'{base}/{folder}/{quote(filename)}'
        try:
            r = requests.head(url, verify=False, timeout=3)
            if r.status_code == 200:
                print(f'  FOUND: {filename}')
                found.append(filename)
        except:
            pass

# Also check if there are subdirectories
# Try RRR which has known structure
for subfolder in ['RRR']:
    for i in range(1, 10):
        for name in ['song', 'track']:
            for fname in [f'{i}.mp3', f'0{i}.mp3', f'{name}-{i}.mp3', f'{name} {i}.mp3']:
                url = f'{base}/Audio/{subfolder}/{fname}'
                try:
                    r = requests.head(url, verify=False, timeout=3)
                    if r.status_code == 200:
                        print(f'  FOUND Audio/{subfolder}/{fname}')
                except:
                    pass

if not found:
    print('  No files found with any pattern!')
    
# Also check Devara (one of the newest, might have a different naming)
print(f"\nTrying Devara patterns...")
for i in range(1, 20):
    for name in ['song', 'track', '']:
        for fname in [f'{name}{i}.mp3', f'{name}-{i}.mp3', f'{name}{i:02d}.mp3', f'{i}.mp3', f'{i:02d}.mp3']:
            if fname.startswith('-'):
                fname = fname[1:]
            url = f'{base}/Audio/Devara/{fname}'
            try:
                r = requests.head(url, verify=False, timeout=2)
                if r.status_code == 200:
                    print(f'  FOUND Audio/Devara/{fname}')
            except:
                pass
