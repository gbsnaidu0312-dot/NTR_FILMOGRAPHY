import os
import sys
import django

sys.path.append(r"c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\backend")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.movies.models import Movie

THUMBNAILS = {
    'Aadi': 'AADI_L.png',
    'Adhurs': 'Adhurs_L.png',
    'Allari Ramudu': 'AllariRamudu_L.png',
    'Andhrawala': 'Andhrawala_L.png',
    'Aravindha Sametha': 'Aravindha Sametha_L.png',
    'Ashok': 'Ashok_L.png',
    'Baadshah': 'Baadshah_L.png',
    'Brindavanam': 'Brindhavanam_L.png',
    'Devara': 'DEVARA_L.png',
    'Dhammu': 'Dhammu_L.png',
    'Janatha Garage': 'Janatha garage_L.png',
    'Naa Alludu': 'Naa Alludu_L.png',
    'Rabhasa': 'RABASA_L.png',
    'Rakhi': 'RAKHI_L.png',
    'RRR': 'RRR_L.png',
    'Ramayya Vasthavayya': 'Ramayya vasthavayya_L.png',
    'Subbu': 'SUBBU_L.png',
    'Samba': 'Samba_L.png',
    'Shakti': 'Shakti_L.png',
    'Simhadri': 'Simhadri_L.png',
    'Temper': 'Temper_L.png',
    'Yamadonga': 'Yamadonga_L.png',
    
    # Newly added ones
    'Naaga': 'Naaga_L.png',
    'Narasimhudu': 'Narasimhudu_L.png',
    'Student No. 1': 'Studeny%20No%201%20_L.png',
    'Kantri': 'KANTRI_L.png',
    'Oosaravelli': 'Oosaravalli_L.png',
    'Nannaku Prematho': 'NKP_L.png',
    'Jai Lava Kusa': 'JAI%20LAVA%20KUSA_L.png',
}

BASE_URL = 'https://ntrfilmography.live/THUMBNAILS/'

print("Updating movie banners in database...")
for title, filename in THUMBNAILS.items():
    try:
        movie = Movie.objects.get(title=title)
        url = BASE_URL + filename
        movie.banner_url = url
        # Use same for poster since we only have L files for now
        movie.poster_url = url 
        movie.save()
        print(f"Updated: {title} -> {url}")
    except Movie.DoesNotExist:
        print(f"Movie not found: {title}")

print("\nDone patching banners!")
