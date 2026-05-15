# Backend Architecture — NTR Filmography

## Project Stack
- **Python 3.x** — Runtime
- **Django 4.2** — Web framework
- **Django REST Framework** — API layer
- **MySQL 5.7+** / SQLite (dev) — Database
- **Cloudflare R2** (S3-compatible) — Media file storage
- **django-cors-headers** — Cross-origin support
- **python-decouple** — Environment config

## Directory Structure
```
backend/
├── config/                # Django project configuration
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py        # All settings: DB, storage, CORS, DRF
│   ├── storage.py         # Cloudflare R2 storage backends
│   ├── urls.py            # Root URL router → includes core.urls
│   └── wsgi.py
├── apps/                  # All Django apps
│   ├── core/              # Base models & URL routing
│   │   ├── models.py      # TimestampedModel (abstract base)
│   │   └── urls.py        # API router using DefaultRouter
│   ├── movies/            # Movie catalog
│   │   ├── models.py      # Movie model
│   │   ├── serializers.py # MovieSerializer, MovieListSerializer
│   │   ├── views.py       # MovieViewSet (ReadOnlyModelViewSet)
│   │   └── admin.py       # MovieAdmin
│   ├── videos/            # Video library (cuts, songs, events, celebrations)
│   │   ├── models.py      # Video model
│   │   ├── serializers.py # VideoSerializer, VideoListSerializer
│   │   ├── views.py       # VideoViewSet (ReadOnlyModelViewSet)
│   │   └── admin.py       # VideoAdmin
│   ├── audio/             # Audio songs
│   │   ├── models.py      # AudioSong model
│   │   ├── serializers.py # AudioSongSerializer, AudioSongListSerializer
│   │   ├── views.py       # AudioSongViewSet (ReadOnlyModelViewSet)
│   │   └── admin.py       # AudioSongAdmin
│   └── photos/            # Photo galleries
│       ├── models.py      # PhotoFolder, Photo models
│       ├── serializers.py # PhotoFolderSerializer, PhotoFolderDetailSerializer, PhotoSerializer
│       ├── views.py       # PhotoFolderViewSet, PhotoViewSet (ReadOnlyModelViewSets)
│       └── admin.py       # PhotoFolderAdmin, PhotoAdmin
├── scripts/
│   └── seed_movies.py     # Populate DB with sample data
├── tools/
│   ├── curl_examples.sh
│   └── postman_collection.json
├── requirements.txt
├── manage.py
└── .env
```

## Database Models

### TimestampedModel (abstract base)
| Field | Type | Notes |
|-------|------|-------|
| created_at | DateTimeField | auto_now_add=True |
| updated_at | DateTimeField | auto_now=True |

### Movie
| Field | Type | Notes |
|-------|------|-------|
| id | AutoField | Primary key |
| title | CharField(255) | Unique |
| slug | SlugField | Unique, auto-generated |
| release_year | IntegerField | |
| description | TextField | |
| poster_url | URLField | Nullable, external URL |
| banner_url | URLField | Nullable, external URL |
| poster_image | ImageField | Uploads to `movies/posters/` |
| banner_image | ImageField | Uploads to `movies/banners/` |
| duration_minutes | IntegerField | Nullable |
| genre | CharField(100) | Nullable |
| director | CharField(100) | Nullable |
| box_office | CharField(100) | Nullable |
| created_at | DateTimeField | Inherited |
| updated_at | DateTimeField | Inherited |
**Ordering**: `[-release_year, title]`
**Indexes**: slug, release_year

### Video
| Field | Type | Notes |
|-------|------|-------|
| id | AutoField | Primary key |
| movie | ForeignKey(Movie) | CASCADE, nullable, related_name='videos' |
| title | CharField(255) | |
| video_type | CharField(20) | Choices: cut / song / event / celebration / ads |
| video_url | URLField | YouTube embed URL |
| thumbnail_url | URLField | Nullable |
| thumbnail_image | ImageField | Uploads to `videos/thumbnails/` |
| duration_seconds | IntegerField | Nullable |
| views | IntegerField | Default 0 |
| description | TextField | Blank |
| created_at | DateTimeField | Inherited |
| updated_at | DateTimeField | Inherited |
**Ordering**: `[-created_at]`
**Indexes**: video_type, movie

### AudioSong
| Field | Type | Notes |
|-------|------|-------|
| id | AutoField | Primary key |
| movie | ForeignKey(Movie) | CASCADE, nullable, related_name='audio_songs' |
| title | CharField(255) | |
| artist | CharField(255) | Nullable |
| music_director | CharField(255) | Nullable |
| audio_url | URLField | SoundCloud or direct audio URL |
| duration_seconds | IntegerField | Nullable |
| track_number | IntegerField | Default 1 |
| plays | IntegerField | Default 0 |
| description | TextField | Blank |
| created_at | DateTimeField | Inherited |
| updated_at | DateTimeField | Inherited |
**Ordering**: `[track_number]`
**Unique**: (movie, track_number)
**Indexes**: movie, track_number

### PhotoFolder
| Field | Type | Notes |
|-------|------|-------|
| id | AutoField | Primary key |
| name | CharField(255) | |
| slug | SlugField | Unique, auto-generated |
| folder_type | CharField(20) | Choices: movie / event / offline |
| movie | ForeignKey(Movie) | CASCADE, nullable, related_name='photo_folders' |
| description | TextField | Blank |
| parent_folder | ForeignKey(self) | CASCADE, nullable, for subfolders |
| created_at | DateTimeField | Inherited |
| updated_at | DateTimeField | Inherited |
**Ordering**: `[name]`
**Unique**: (name, folder_type)
**Indexes**: folder_type, movie

### Photo
| Field | Type | Notes |
|-------|------|-------|
| id | AutoField | Primary key |
| folder | ForeignKey(PhotoFolder) | CASCADE, related_name='photos' |
| image_url | URLField | Nullable, external URL |
| image | ImageField | Uploads to `photos/` |
| thumbnail_url | URLField | Nullable |
| thumbnail | ImageField | Uploads to `photos/thumbnails/` |
| caption | CharField(255) | Blank |
| order | IntegerField | Default 0 |
| created_at | DateTimeField | Inherited |
| updated_at | DateTimeField | Inherited |
**Ordering**: `[order, -created_at]`
**Indexes**: folder, order

## API Endpoints

All endpoints are **read-only** (GET only). No POST/PUT/DELETE exposed via API.

```
Base: http://localhost:8000/api/

Movies
  GET  /api/movies/                    → MovieListSerializer (paginated)
  GET  /api/movies/?search=query       → Search by title/description
  GET  /api/movies/{slug}/             → MovieSerializer (full detail)
  GET  /api/movies/{slug}/video-cuts/  → VideoSerializer[] (type='cut')
  GET  /api/movies/{slug}/video-songs/ → VideoSerializer[] (type='song')
  GET  /api/movies/{slug}/audio-songs/ → AudioSongSerializer[]

Videos
  GET  /api/videos/                       → VideoListSerializer (paginated)
  GET  /api/videos/?type=cut|song|event|celebration|ads
  GET  /api/videos/?movie=ID
  GET  /api/videos/?search=query
  GET  /api/videos/{id}/                  → VideoSerializer (full detail)

Audio Songs
  GET  /api/audio-songs/              → AudioSongListSerializer (paginated)
  GET  /api/audio-songs/?search=query
  GET  /api/audio-songs/{id}/         → AudioSongSerializer (full detail)

Photo Folders
  GET  /api/photos/folders/                → PhotoFolderSerializer[] (root folders only)
  GET  /api/photos/folders/?type=movie|event|offline
  GET  /api/photos/folders/{slug}/         → PhotoFolderDetailSerializer (includes nested photos)
  GET  /api/photos/folders/{slug}/subfolders/

Photos
  GET  /api/photos/                 → PhotoSerializer[] (paginated)
  GET  /api/photos/?folder=ID
  GET  /api/photos/{id}/            → PhotoSerializer
```

## DRF Configuration
- **Pagination**: PageNumberPagination, 50 per page
- **Filter backends**: SearchFilter, OrderingFilter
- **CORS**: Whitelisted origins from `.env` (default: localhost:3000, 5173)

## Cloudflare R2 Storage
- Toggle via `USE_CLOUDFLARE_R2` env variable
- Custom storage classes in `config/storage.py`:
  - `MediaStorage` → `media/`
  - `MoviePosterStorage` → `movies/posters/`
  - `MovieBannerStorage` → `movies/banners/`
  - `PhotoImageStorage` → `photos/images/`
  - `PhotoThumbnailStorage` → `photos/thumbnails/`
  - `VideoThumbnailStorage` → `videos/thumbnails/`
  - `AudioStorage` → `audio/`
- Falls back to local `media/` directory when not using R2

## Seed Data (`scripts/seed_movies.py`)
Run with: `python manage.py shell < scripts/seed_movies.py`
- Creates 5+ movies with posters/banners
- Creates video cuts & songs for first 3 movies
- Creates audio songs for first 3 movies
- Creates photo folders (movie, event, offline types) with sample photos
- All media URLs use `via.placeholder.com` as placeholders

## Admin Panel
URL: `http://localhost:8000/admin/`
Each model registered with custom ModelAdmin:
- **MovieAdmin**: list by title/year, search, prepopulated slug
- **VideoAdmin**: list by title/type/movie, filter by type/movie
- **AudioSongAdmin**: list by track/title/artist/movie, filter by movie
- **PhotoFolderAdmin**: list by name/type/movie, hierarchical
- **PhotoAdmin**: list by caption/folder/order, filter by folder
