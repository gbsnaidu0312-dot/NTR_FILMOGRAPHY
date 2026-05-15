import requests

BASE = 'http://127.0.0.1:8000/api'

# Check movies
print('=== Movie Detail (devara) ===')
r = requests.get(f'{BASE}/movies/devara/')
print(f'Status: {r.status_code}')
if r.ok:
    d = r.json()
    print(f'Title: {d["title"]}')
    print(f'Poster: {bool(d.get("poster_url"))}')
    print(f'Banner: {bool(d.get("banner_url"))}')

# Check nested actions
for action in ['audio-songs', 'video-cuts', 'video-songs']:
    r = requests.get(f'{BASE}/movies/devara/{action}/')
    print(f'\n=== /movies/devara/{action}/ ===')
    print(f'Status: {r.status_code}')
    if r.ok:
        data = r.json()
        print(f'Count: {len(data) if isinstance(data, list) else len(data.get("results", data))}')

# Check video types
print('\n=== Videos ===')
for t in ['song', 'cut', 'event', 'celebration']:
    r = requests.get(f'{BASE}/videos/', params={'type': t})
    if r.ok:
        data = r.json()
        results = data.get('results') or data
        print(f'{t}: {len(results)} videos')
        if results:
            v = results[0]
            print(f'  First: {v.get("title")} (folder: {v.get("folder_name", "N/A")})')

print('\n=== Photos ===')
for t in ['movie', 'event', 'offline']:
    r = requests.get(f'{BASE}/photos/folders/', params={'type': t})
    if r.ok:
        data = r.json()
        results = data.get('results') or data
        print(f'{t}: {len(results)} folders')
        if results:
            print(f'  First: {results[0].get("name")} ({results[0].get("photo_count", "?")} photos)')

print('\n=== Done ===')
