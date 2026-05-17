import os
import sys
import django
import urllib.parse

sys.path.append(r"c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\backend")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.movies.models import Movie

POSTERS = {
    'Ninnu Choodalani': 'NINNU CHUDALANI.png',
    'Student No. 1': 'STUDENT No1.png',
    'Subbu': 'SUBBU.png',
    'Aadi': 'AADI.png',
    'Allari Ramudu': 'ALLARI RAMUDU.png',
    'Naaga': 'NAAGA.png',
    'Simhadri': 'SIMHADRI.png',
    'Andhrawala': 'ANDHRAWALA.png',
    'Samba': 'SAMBA.png',
    'Naa Alludu': 'NAA ALLUDU.png',
    'Narasimhudu': 'NARASIMHUDU.png',
    'Ashok': 'ASHOK.png',
    'Rakhi': 'RAKHI.png',
    'Yamadonga': 'YAMADONGA.png',
    'Kantri': 'KANTRI.png',
    'Adhurs': 'Adhurs.png',
    'Brindavanam': 'BRINDHAVANAM.png',
    'Shakti': 'SHAKTI.png',
    'Oosaravelli': 'Oosaravalli.png',
    'Dhammu': 'DHAMMU.png',
    'Baadshah': 'BAADSHAH.png',
    'Ramayya Vasthavayya': 'RAMAYYA VASTAVAYYA.png',
    'Rabhasa': 'RABASA.png',
    'Temper': 'TEMPER.png',
    'Nannaku Prematho': 'NKP.png',
    'Janatha Garage': 'JANATAGARAGE.png',
    'Jai Lava Kusa': 'JAI LAVAKUSA.png',
    'Aravindha Sametha': 'ARAVINDA SAMETHA.png',
    'RRR': 'RRR.png',
    'Devara': 'DEVARA.png',
}

BASE_URL = 'https://ntrfilmography.live/THUMBNAIL_P/'

print("Updating movie portraits in database...")
for title, filename in POSTERS.items():
    try:
        movie = Movie.objects.get(title=title)
        
        # URL encode the filename to handle spaces properly (e.g. ALLARI RAMUDU.png -> ALLARI%20RAMUDU.png)
        encoded_filename = urllib.parse.quote(filename)
        url = BASE_URL + encoded_filename
        
        movie.poster_url = url 
        movie.save()
        print(f"Updated: {title} -> {url}")
    except Movie.DoesNotExist:
        print(f"Movie not found: {title}")

print("\nDone patching portrait thumbnails!")
