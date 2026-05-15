import requests
BASE = 'http://127.0.0.1:8000/api'

print('=== MOVIES (First 3) ===')
r = requests.get(f'{BASE}/movies/')
data = r.json()
for m in data.get('results', [])[:3]:
    print(f'{m["title"]}: poster={bool(m.get("poster_url"))}, slug={m["slug"]}')

print('\n=== MOVIE DETAIL (devara) ===')
r = requests.get(f'{BASE}/movies/devara/')
m = r.json()
for k, v in m.items():
    if v and k not in ['description', 'created_at', 'updated_at']:
        print(f'  {k}: {str(v)[:80]}')

print('\n=== AUDIO (devara) ===')
r = requests.get(f'{BASE}/movies/devara/audio-songs/')
songs = r.json()
print(f'Count: {len(songs)}')
for s in songs[:3]:
    print(f'  {s["title"]}: audio_url={bool(s.get("audio_url"))}, track={s.get("track_number")}')

print('\n=== VIDEO CUTS (devara) ===')
r = requests.get(f'{BASE}/movies/devara/video-cuts/')
vids = r.json()
print(f'Count: {len(vids)}')
for v in vids[:2]:
    print(f'  {v.get("title")}: video_url={bool(v.get("video_url"))}, folder={v.get("folder_name")}')

print('\n=== VIDEO SONGS (devara) ===')
r = requests.get(f'{BASE}/movies/devara/video-songs/')
vids = r.json()
print(f'Count: {len(vids)}')
for v in vids[:2]:
    print(f'  {v.get("title")}: video_url={bool(v.get("video_url"))}, folder={v.get("folder_name")}')

print('\n=== PHOTOS ===')
for t in ['movie', 'event', 'offline']:
    r = requests.get(f'{BASE}/photos/folders/', params={'type': t})
    folders = r.json().get('results', [])
    print(f'{t}: {len(folders)} folders')
    if folders:
        f = folders[0]
        print(f'  First: {f["name"]} ({f.get("photo_count", "?")})')

print('\n=== VIDEOS (Events) ===')
r = requests.get(f'{BASE}/videos/', params={'type': 'event'})
vids = r.json().get('results', [])
print(f'Count: {len(vids)}')
folders = set(v.get('folder_name', 'N/A') for v in vids)
print(f'Unique folder_names: {folders}')

print('\n=== VIDEOS (Celebration) ===')
r = requests.get(f'{BASE}/videos/', params={'type': 'celebration'})
vids = r.json().get('results', [])
print(f'Count: {len(vids)}')
folders = set(v.get('folder_name', 'N/A') for v in vids)
print(f'Unique folder_names: {folders}')

print('\n=== DONE ===')
