import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from apps.videos.models import Video

print("Forcing update for Video Songs...")
songs = Video.objects.filter(video_type='song')
updated = 0
for v in songs:
    url = v.video_url
    if '/Devara/' in url:
        v.folder_name = 'Devara'
    elif '/R R R/' in url or '/RRR/' in url:
        v.folder_name = 'RRR'
    elif '/Aadi/' in url:
        v.folder_name = 'Aadi'
    elif '/Adhurs/' in url:
        v.folder_name = 'Adhurs'
    elif '/Aravindha Sametha/' in url or '/ASVR/' in url:
        v.folder_name = 'Aravindha Sametha'
    elif '/Brindavanam/' in url:
        v.folder_name = 'Brindavanam'
    elif '/Temper/' in url:
        v.folder_name = 'Temper'
    elif '/Oosaravelli/' in url:
        v.folder_name = 'Oosaravelli'
    elif '/Yamadonga/' in url:
        v.folder_name = 'Yamadonga'
    elif '/Simhadri/' in url:
        v.folder_name = 'Simhadri'
    elif '/Student No 1/' in url:
        v.folder_name = 'Student No 1'
    elif '/Rakhi/' in url:
        v.folder_name = 'Rakhi'
    elif '/Nannaku Prematho/' in url:
        v.folder_name = 'Nannaku Prematho'
    elif '/Janatha Garage/' in url:
        v.folder_name = 'Janatha Garage'
    elif '/Jai Lava Kusa/' in url:
        v.folder_name = 'Jai Lava Kusa'
    elif '/Baadshah/' in url:
        v.folder_name = 'Baadshah'
    elif '/Dhammu/' in url:
        v.folder_name = 'Dhammu'
    elif '/Kantri/' in url:
        v.folder_name = 'Kantri'
    elif '/Samba/' in url:
        v.folder_name = 'Samba'
    elif '/Rabhasa/' in url:
        v.folder_name = 'Rabhasa'
    elif '/Ramayya Vasthavayya/' in url:
        v.folder_name = 'Ramayya Vasthavayya'
    elif '/Shakti/' in url:
        v.folder_name = 'Shakti'
    elif '/Ashok/' in url:
        v.folder_name = 'Ashok'
    elif '/Andhrawala/' in url:
        v.folder_name = 'Andhrawala'
    elif '/Allari Ramudu/' in url:
        v.folder_name = 'Allari Ramudu'
    elif '/Naaga/' in url:
        v.folder_name = 'Naaga'
    elif '/Narasimhudu/' in url:
        v.folder_name = 'Narasimhudu'
    elif '/Subbu/' in url:
        v.folder_name = 'Subbu'
    elif '/Ninnu Choodalani/' in url:
        v.folder_name = 'Ninnu Choodalani'
    else:
        # Fallback to simple split logic
        import urllib.parse
        parts = urllib.parse.unquote(url).split('/')
        if 'Video Songs' in parts:
            idx = parts.index('Video Songs')
            v.folder_name = parts[idx+1]
        elif len(parts) > 4:
            v.folder_name = parts[4] # Just guess the 5th part
        else:
            v.folder_name = "Unknown"

    v.save()
    updated += 1

print(f"Updated {updated} video songs.")
