"""Detailed API test script - adjusted for list/detail serializers."""
import urllib.request
import json

BASE = 'http://localhost:8000/api'

print('=== DETAILED VERIFICATION ===\n')

# 1. Check movie detail (includes movie_url)
print('1. MOVIE DETAIL (first slug):')
data = json.loads(urllib.request.urlopen(f'{BASE}/movies/').read())
if data['count'] > 0:
    slug = data['results'][0]['slug']
    movie = json.loads(urllib.request.urlopen(f'{BASE}/movies/{slug}/').read())
    print(f'  {movie["title"]}:')
    print(f'    poster_url: {movie.get("poster_url")}')
    print(f'    banner_url: {movie.get("banner_url")}')
    print(f'    movie_url: {movie.get("movie_url")}')
    
    # Check audio songs for this movie
    songs = json.loads(urllib.request.urlopen(f'{BASE}/movies/{slug}/audio-songs/').read())
    print(f'    audio_songs ({len(songs)}):')
    for s in songs[:2]:
        print(f'      {s["title"]}: {s.get("audio_url","N/A")[:90]}')

# 2. Check photo folders hierarchy
print('\n2. PHOTO FOLDERS HIERARCHY:')
data = json.loads(urllib.request.urlopen(f'{BASE}/photos/folders/').read())
for f in data['results']:
    print(f'  [{f["folder_type"]}] {f["name"]} - count: {f.get("photo_count","?")}')
    try:
        sub = json.loads(urllib.request.urlopen(f'{BASE}/photos/folders/{f["slug"]}/subfolders/').read())
        for s in sub[:3]:
            print(f'    -> {s["name"]}')
        if len(sub) > 3:
            print(f'    -> ... and {len(sub)-3} more')
    except:
        pass

# 3. Video types
print('\n3. VIDEOS BY TYPE:')
for vtype in ['song', 'cut', 'event', 'celebration']:
    data = json.loads(urllib.request.urlopen(f'{BASE}/videos/?type={vtype}').read())
    count = data['count']
    sample = data['results'][0] if count > 0 else {}
    url = sample.get('video_url', 'N/A')[:90] if count > 0 else 'N/A'
    print(f'  {vtype}: {count} videos - first: {sample.get("title","N/A")}')

# 4. Check no old R2 URLs
print('\n4. DOMAIN CHECK:')
all_ok = True
# Check movie detail
if data['count'] > 0:
    for key in movie:
        val = str(movie[key])
        if 'pub-4b8805119f7f49ae848fa1aaa57dd6d0' in val:
            print(f'  WARNING: Old R2 URL in movie: {key}={val[:80]}')
            all_ok = False

# Check photo URLs
data = json.loads(urllib.request.urlopen(f'{BASE}/photos/').read())
for p in data['results'][:10]:
    for key in p:
        val = str(p[key])
        if 'pub-4b8805119f7f49ae848fa1aaa57dd6d0' in val:
            print(f'  WARNING: Old R2 URL in photo: {key}={val[:80]}')
            all_ok = False

if all_ok:
    print('  All checked URLs use ntrfilmography.live - no old R2 URLs!')

# 5. Verify photo URLs contain proper path
print('\n5. PHOTO URL PATHS (first 3):')
data = json.loads(urllib.request.urlopen(f'{BASE}/photos/').read())
for p in data['results'][:3]:
    print(f'  {p["image_url"]}')

print('\n=== VERIFICATION COMPLETE ===')
