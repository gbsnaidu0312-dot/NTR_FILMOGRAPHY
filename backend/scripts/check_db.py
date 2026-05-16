from apps.photos.models import PhotoFolder

roots = PhotoFolder.objects.filter(parent_folder__isnull=True)
for f in roots:
    sub = f.subfolders.count()
    photos = f.photos.count()
    print(f'[{f.folder_type}] "{f.name}" -> direct_photos:{photos}, subfolders:{sub}')

print()
movie_root = PhotoFolder.objects.filter(folder_type='movie', parent_folder__isnull=True).first()
if movie_root:
    print('Movie subfolders (first 8):')
    for sf in movie_root.subfolders.all()[:8]:
        sub2 = sf.subfolders.count()
        p = sf.photos.count()
        print(f'  "{sf.name}" -> photos:{p}, sub-sub:{sub2}')

print()
# Count total photos reachable via movie subfolders
from django.db.models import Sum, Count
movie_folders = PhotoFolder.objects.filter(folder_type='movie')
total = sum(f.photos.count() for f in movie_folders)
print(f'Total photos in all movie-type folders: {total}')
