import os
import sys
import django

sys.path.append(r"c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\backend")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.movies.models import Movie

ORDER_LIST = [
    "War 2",
    "Devara",
    "RRR",
    "Aravindha Sametha",
    "Jai Lava Kusa",
    "Janatha Garage",
    "Nannaku Prematho",
    "Temper",
    "Rabhasa",
    "Ramayya Vasthavayya",
    "Baadshah",
    "Dhammu",
    "Oosaravelli",
    "Shakti",
    "Brindavanam",
    "Adhurs",
    "Kantri",
    "Yamadonga",
    "Rakhi",
    "Ashok",
    "Narasimhudu",
    "Naa Alludu",
    "Samba",
    "Andhrawala",
    "Simhadri",
    "Naaga",
    "Allari Ramudu",
    "Aadi",
    "Subbu",
    "Student No. 1",
    "Ninnu Choodalani"
]

# Provide fallback mappings for title differences if any (e.g. "Devara: Part 1" -> "Devara")
# The ORDER_LIST above uses the exact titles as stored in the DB previously based on scripts.

print("Updating movie sort order...")

for index, title in enumerate(ORDER_LIST):
    sort_order = index + 1
    try:
        movie = Movie.objects.get(title__iexact=title)
        movie.sort_order = sort_order
        movie.save()
        print(f"[{sort_order}] Set order for: {movie.title}")
    except Movie.DoesNotExist:
        # Try a fuzzy match if exact fails
        try:
            movie = Movie.objects.filter(title__icontains=title.split(":")[0]).first()
            if movie:
                movie.sort_order = sort_order
                movie.save()
                print(f"[{sort_order}] Set order for (fuzzy): {movie.title}")
            else:
                print(f"[{sort_order}] Movie NOT FOUND: {title}")
        except Exception as e:
            print(f"Error matching {title}: {e}")

print("\nDone patching movie order!")
