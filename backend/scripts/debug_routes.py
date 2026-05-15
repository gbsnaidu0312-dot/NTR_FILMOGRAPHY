import requests

BASE = 'http://127.0.0.1:8000/api'

# List all movies with slugs
r = requests.get(f'{BASE}/movies/')
data = r.json()
results = data.get('results') or data
for m in results:
    print(f'{m["title"]}: slug="{m["slug"]}"')

# Try accessing actions with slug
for m in results[:3]:
    slug = m['slug']
    for action in ['audio-songs', 'video-cuts', 'video-songs']:
        url = f'{BASE}/movies/{slug}/{action}/'
        r2 = requests.get(url)
        print(f'{url}: {r2.status_code}')
        if r2.status_code == 200:
            try:
                print(f'  -> {len(r2.json())} items')
            except:
                print(f'  -> response: {r2.text[:100]}')
