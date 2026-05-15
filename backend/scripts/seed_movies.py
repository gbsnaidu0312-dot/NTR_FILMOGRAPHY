#!/usr/bin/env python
"""
Seed script to populate NTR Filmography database with sample data
Run with: python manage.py shell < scripts/seed_movies.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.movies.models import Movie
from apps.videos.models import Video
from apps.audio.models import AudioSong
from apps.photos.models import PhotoFolder, Photo

R2_PUBLIC_URL = 'https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev'

# Sample R2 media paths
R2_SAMPLE_IMAGE = f'{R2_PUBLIC_URL}/sample/79.jpg'
R2_SAMPLE_VIDEO = f'{R2_PUBLIC_URL}/sample/Inshot%2020260402%20100243956.mp4'


def create_sample_data():
    """Create sample movies, videos, audio songs, and photos"""
    
    # Sample movie data
    movies_data = [
        {
            'title': 'RRR',
            'release_year': 2022,
            'description': 'RRR is an Indian Telugu-language period action film written and directed by S. S. Rajamouli. The film stars Ram Charan and N. T. Rama Rao Jr. in the lead roles. Set in 1920s India, it follows the journey of two freedom fighters from the British Raj.',
            'genre': 'Action/Drama',
            'director': 'S. S. Rajamouli',
            'duration_minutes': 187,
            'box_office': '$150M+',
            'poster_url': R2_SAMPLE_IMAGE,
            'banner_url': R2_SAMPLE_IMAGE,
        },
        {
            'title': 'Devara',
            'release_year': 2024,
            'description': 'Devara is a high-octane action drama that showcases Jr. NTR in a never-before-seen avatar. The film is a stylish take on a timeless tale of heroism and bravery.',
            'genre': 'Action',
            'director': 'Kortala Siva',
            'duration_minutes': 148,
            'box_office': '$100M+',
            'poster_url': R2_SAMPLE_IMAGE,
            'banner_url': R2_SAMPLE_IMAGE,
        },
        {
            'title': 'Simhadri',
            'release_year': 2023,
            'description': 'Simhadri is an action-packed thriller that demonstrates the versatility of Jr. NTR as an actor. The film blends intense action sequences with a compelling narrative.',
            'genre': 'Action/Thriller',
            'director': 'Mohan Raja',
            'duration_minutes': 152,
            'box_office': '$80M+',
            'poster_url': R2_SAMPLE_IMAGE,
            'banner_url': R2_SAMPLE_IMAGE,
        },
        {
            'title': 'Aadi',
            'release_year': 2020,
            'description': 'Aadi is a romantic action film featuring Jr. NTR in a dynamic dual role. The film showcases romance, action, and drama in equal measure.',
            'genre': 'Action/Romance',
            'director': 'V.V. Vinayak',
            'duration_minutes': 165,
            'box_office': '$60M+',
            'poster_url': R2_SAMPLE_IMAGE,
            'banner_url': R2_SAMPLE_IMAGE,
        },
        {
            'title': 'Temper',
            'release_year': 2015,
            'description': 'Temper is a cop drama that showcases Jr. NTR in a powerful role. The film is known for its intense action sequences and powerful performances.',
            'genre': 'Action/Drama',
            'director': 'Puri Jagannath',
            'duration_minutes': 158,
            'box_office': '$45M+',
            'poster_url': R2_SAMPLE_IMAGE,
            'banner_url': R2_SAMPLE_IMAGE,
        },
    ]

    # Create or update movies
    for movie_data in movies_data:
        movie, created = Movie.objects.update_or_create(
            title=movie_data['title'],
            defaults={
                'release_year': movie_data['release_year'],
                'description': movie_data['description'],
                'genre': movie_data['genre'],
                'director': movie_data['director'],
                'duration_minutes': movie_data['duration_minutes'],
                'box_office': movie_data['box_office'],
                'poster_url': movie_data['poster_url'],
                'banner_url': movie_data['banner_url'],
            }
        )
        status = "Created" if created else "Updated"
        print(f"{status}: {movie.title}")

    # Create sample videos
    print("\n--- Creating Sample Videos ---")
    movies = Movie.objects.all()[:3]  # Use first 3 movies
    
    for movie in movies:
        # Video cuts
        for i in range(3):
            Video.objects.get_or_create(
                movie=movie,
                title=f"{movie.title} - Trailer {i+1}",
                defaults={
                    'video_type': 'cut',
                    'video_url': R2_SAMPLE_VIDEO,
                    'thumbnail_url': R2_SAMPLE_IMAGE,
                    'duration_seconds': 150 + (i * 30),
                    'views': 50000 + (i * 10000),
                    'description': f'Official trailer for {movie.title}',
                }
            )
        
        # Video songs
        for i in range(2):
            Video.objects.get_or_create(
                movie=movie,
                title=f"{movie.title} - Song {i+1}",
                defaults={
                    'video_type': 'song',
                    'video_url': R2_SAMPLE_VIDEO,
                    'thumbnail_url': R2_SAMPLE_IMAGE,
                    'duration_seconds': 240 + (i * 30),
                    'views': 100000 + (i * 50000),
                    'description': f'Music video from {movie.title}',
                }
            )

    # Create sample audio songs
    print("--- Creating Sample Audio Songs ---")
    for movie in movies:
        for i in range(4):
            AudioSong.objects.get_or_create(
                movie=movie,
                track_number=i+1,
                defaults={
                    'title': f"{movie.title} - Track {i+1}",
                    'artist': 'Various Artists',
                    'music_director': 'Music Director',
                    'audio_url': R2_SAMPLE_VIDEO,
                    'duration_seconds': 200 + (i * 20),
                    'plays': 10000 + (i * 5000),
                    'description': f'Audio track from {movie.title}',
                }
            )

    # Create sample photo folders
    print("--- Creating Sample Photo Folders ---")
    
    # Movie photos
    for movie in movies:
        folder, created = PhotoFolder.objects.get_or_create(
            name=movie.title,
            folder_type='movie',
            defaults={
                'movie': movie,
                'description': f'Photo gallery from {movie.title}',
            }
        )
        
        # Add sample photos to folder
        for j in range(5):
            Photo.objects.get_or_create(
                folder=folder,
                order=j+1,
                defaults={
                    'image_url': R2_SAMPLE_IMAGE,
                    'thumbnail_url': R2_SAMPLE_IMAGE,
                    'caption': f'Behind the scenes photo {j+1} from {movie.title}',
                }
            )
    
    # Event folders
    event_data = [
        {'name': 'Audio Launch', 'type': 'Awards'},
        {'name': 'Press Conference', 'type': 'Awards'},
        {'name': 'Movie Premiere', 'type': 'Awards'},
    ]
    
    for event in event_data:
        folder, created = PhotoFolder.objects.get_or_create(
            name=event['name'],
            folder_type='event',
            defaults={
                'description': f'Photos from {event["name"]}',
            }
        )
        
        # Add sample photos
        for j in range(4):
            Photo.objects.get_or_create(
                folder=folder,
                order=j+1,
                defaults={
                    'image_url': R2_SAMPLE_IMAGE,
                    'thumbnail_url': R2_SAMPLE_IMAGE,
                    'caption': f'Event photo {j+1} from {event["name"]}',
                }
            )
    
    # Offline photos
    offline_folder, _ = PhotoFolder.objects.get_or_create(
        name='Candid Moments',
        folder_type='offline',
        defaults={
            'description': 'Candid moments and personal photos',
        }
    )
    
    for j in range(6):
        Photo.objects.get_or_create(
            folder=offline_folder,
            order=j+1,
            defaults={
                'image_url': R2_SAMPLE_IMAGE,
                'thumbnail_url': R2_SAMPLE_IMAGE,
                'caption': f'Candid photo {j+1}',
            }
        )

    print("\n✅ Sample data created successfully!")
    print(f"Total Movies: {Movie.objects.count()}")
    print(f"Total Videos: {Video.objects.count()}")
    print(f"Total Audio Songs: {AudioSong.objects.count()}")
    print(f"Total Photo Folders: {PhotoFolder.objects.count()}")
    print(f"Total Photos: {Photo.objects.count()}")

if __name__ == '__main__':
    create_sample_data()

from apps.movies.models import Movie
from apps.videos.models import Video
from apps.audio.models import AudioSong
from apps.photos.models import PhotoFolder, Photo

# Clear existing data
Movie.objects.all().delete()
Video.objects.all().delete()
AudioSong.objects.all().delete()
PhotoFolder.objects.all().delete()
Photo.objects.all().delete()

# Sample movies data
movies_data = [
    {
        'title': 'RRR',
        'release_year': 2022,
        'description': 'Two Indian revolutionaries in the 1920s wage an epic fight against the British Raj to free their country, and each other, from oppression.',
        'genre': 'Action, Drama',
        'director': 'S. S. Rajamouli',
        'duration_minutes': 187,
        'box_office': '$140M+',
        'poster_url': R2_SAMPLE_IMAGE,
        'banner_url': R2_SAMPLE_IMAGE
    },
    {
        'title': 'Devara',
        'release_year': 2024,
        'description': 'A fearless man from a coastal village defies the odds and storms into the world of gangs and gangsters.',
        'genre': 'Action, Drama',
        'director': 'Kortala Siva',
        'duration_minutes': 180,
        'box_office': '$50M+',
        'poster_url': R2_SAMPLE_IMAGE,
        'banner_url': R2_SAMPLE_IMAGE
    },
    {
        'title': 'Simhadri',
        'release_year': 2003,
        'description': 'A village headman decides to sacrifice his own life to avenge the injustice meted out to poor villagers.',
        'genre': 'Action, Drama',
        'director': 'Rajamouli',
        'duration_minutes': 165,
        'box_office': '$20M',
        'poster_url': R2_SAMPLE_IMAGE,
        'banner_url': R2_SAMPLE_IMAGE
    },
    {
        'title': 'Aadi',
        'release_year': 2002,
        'description': 'A young man falls in love with a girl from a rival family and must overcome obstacles to be with her.',
        'genre': 'Romance, Action',
        'director': 'V.V. Vinayak',
        'duration_minutes': 147,
        'box_office': '$15M',
        'poster_url': R2_SAMPLE_IMAGE,
        'banner_url': R2_SAMPLE_IMAGE
    },
    {
        'title': 'Temper',
        'release_year': 2015,
        'description': 'A tough and disciplined police officer is suspended from duty, and his journey becomes a test of his character.',
        'genre': 'Crime, Drama, Thriller',
        'director': 'Puri Jagannath',
        'duration_minutes': 145,
        'box_office': '$35M',
        'poster_url': R2_SAMPLE_IMAGE,
        'banner_url': R2_SAMPLE_IMAGE
    },
    {
        'title': 'Yamadonga',
        'release_year': 2007,
        'description': 'A young man who lives like a gang leader faces the challenges of settling down in life.',
        'genre': 'Comedy, Action',
        'director': 'Puri Jagannath',
        'duration_minutes': 168,
        'box_office': '$18M',
        'poster_url': R2_SAMPLE_IMAGE,
        'banner_url': R2_SAMPLE_IMAGE
    },
]

# Create movies
created_movies = []
for movie_data in movies_data:
    movie = Movie.objects.create(**movie_data)
    created_movies.append(movie)
    print(f"Created movie: {movie.title}")

# Create videos for each movie
video_data = [
    {'title': 'Action Teaser', 'video_type': 'cut', 'duration_seconds': 120},
    {'title': 'First Look Trailer', 'video_type': 'cut', 'duration_seconds': 240},
    {'title': 'Official Trailer', 'video_type': 'cut', 'duration_seconds': 180},
    {'title': 'Behind the Scenes', 'video_type': 'cut', 'duration_seconds': 900},
    {'title': 'Title Track Song', 'video_type': 'song', 'duration_seconds': 300},
    {'title': 'Love Song', 'video_type': 'song', 'duration_seconds': 300},
]

for movie in created_movies[:3]:  # Add videos to first 3 movies
    for i, v_data in enumerate(video_data):  # Use all video types (cut + song)
        Video.objects.create(
            movie=movie,
            title=f"{movie.title} - {v_data['title']}",
            video_type=v_data['video_type'],
            video_url=R2_SAMPLE_VIDEO,
            thumbnail_url=R2_SAMPLE_IMAGE,
            duration_seconds=v_data['duration_seconds'],
            views=1000 + i * 500
        )
        print(f"  Created video: {v_data['title']}")

# Create audio songs
audio_data = [
    {'title': 'Chuttamalle', 'artist': 'Kaala Bhairava', 'music_director': 'MM Keeravani', 'duration_seconds': 240},
    {'title': 'Naatu Naatu', 'artist': 'Kaala Bhairava', 'music_director': 'MM Keeravani', 'duration_seconds': 180},
    {'title': 'Janani Janani', 'artist': 'Rahul Sipligunj', 'music_director': 'MM Keeravani', 'duration_seconds': 200},
]

for movie in created_movies[:3]:  # Add audio to first 3 movies
    for i, a_data in enumerate(audio_data, 1):
        AudioSong.objects.create(
            movie=movie,
            title=a_data['title'],
            artist=a_data['artist'],
            music_director=a_data['music_director'],
            audio_url=R2_SAMPLE_VIDEO,
            duration_seconds=a_data['duration_seconds'],
            track_number=i,
            plays=5000 + i * 1000
        )
        print(f"  Created audio: {a_data['title']}")

# Create photo folders and sample photos
folder_types = [
    {'name': 'Aadi', 'folder_type': 'movie'},
    {'name': 'Simhadri', 'folder_type': 'movie'},
    {'name': 'Devara', 'folder_type': 'movie'},
    {'name': 'Movie Events', 'folder_type': 'event'},
    {'name': 'Award Shows', 'folder_type': 'event'},
    {'name': 'Personal Photos', 'folder_type': 'offline'},
]

for folder_data in folder_types:
    if folder_data['folder_type'] == 'movie':
        movie = next((m for m in created_movies if m.title.lower() == folder_data['name'].lower()), None)
        folder = PhotoFolder.objects.create(
            name=folder_data['name'],
            folder_type=folder_data['folder_type'],
            movie=movie,
            description=f"Photo gallery for {folder_data['name']}"
        )
    else:
        folder = PhotoFolder.objects.create(
            name=folder_data['name'],
            folder_type=folder_data['folder_type'],
            description=f"Photo gallery for {folder_data['name']}"
        )

    # Add sample photos to each folder
    for j in range(1, 6):
        Photo.objects.create(
            folder=folder,
            image_url=R2_SAMPLE_IMAGE,
            thumbnail_url=R2_SAMPLE_IMAGE,
            caption=f'Photo {j} from {folder.name}',
            order=j
        )
    print(f"Created folder: {folder.name} with 5 photos")

print("\n✅ Seed data created successfully!")
print(f"📊 Statistics:")
print(f"   - Movies: {Movie.objects.count()}")
print(f"   - Videos: {Video.objects.count()}")
print(f"   - Audio Songs: {AudioSong.objects.count()}")
print(f"   - Photo Folders: {PhotoFolder.objects.count()}")
print(f"   - Photos: {Photo.objects.count()}")
