# NTR Filmography - API Documentation

Complete API documentation for NTR Filmography backend.

## Base URL
```
http://localhost:8000/api
```

## Response Format

All responses are in JSON format with the following structure:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/movies/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Movie Title",
      "slug": "movie-slug",
      "...": "...other fields..."
    }
  ]
}
```

## Pagination

- Default page size: 50 items
- Use `?page=2` to get the next page

## Filtering and Searching

- Use `?search=keyword` to search
- Use `?type=value` to filter by type
- Use `?ordering=field` to sort (prefix with `-` for descending)

---

## 📽️ Movies Endpoints

### Get All Movies
```http
GET /api/movies/
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `search` - Search by title or description
- `ordering` - Sort by field (e.g., `-release_year`)

**Response:**
```json
{
  "count": 30,
  "results": [
    {
      "id": 1,
      "title": "RRR",
      "slug": "rrr",
      "release_year": 2022,
      "poster_url": "https://...",
      "genre": "Action/Drama",
      "director": "S. S. Rajamouli",
      "duration_minutes": 187,
      "box_office": "$150M+",
      "banner_url": "https://...",
      "description": "Film description...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Movie by Slug
```http
GET /api/movies/{slug}/
```

**Example:**
```http
GET /api/movies/rrr/
```

**Response:** Single movie object (see above)

### Get Video Cuts
```http
GET /api/movies/{slug}/video-cuts/
```

**Response:**
```json
[
  {
    "id": 1,
    "movie": 1,
    "title": "Official Trailer",
    "video_type": "cut",
    "video_url": "https://youtube.com/...",
    "thumbnail_url": "https://...",
    "duration_seconds": 150,
    "views": 50000,
    "description": "Official trailer...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Video Songs
```http
GET /api/movies/{slug}/video-songs/
```

**Response:** Array of video song objects (same structure as video cuts)

### Get Audio Songs
```http
GET /api/movies/{slug}/audio-songs/
```

**Response:**
```json
[
  {
    "id": 1,
    "movie": 1,
    "title": "Song Title",
    "artist": "Singer Name",
    "music_director": "Director Name",
    "audio_url": "https://soundcloud.com/...",
    "duration_seconds": 240,
    "track_number": 1,
    "plays": 10000,
    "description": "Song description...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

---

## 🎬 Videos Endpoints

### Get All Videos
```http
GET /api/videos/
```

**Query Parameters:**
- `type` - Filter by type: `cut`, `song`, `event`, `celebration`, `ads`
- `search` - Search by title or description
- `ordering` - Sort by field (e.g., `-views`, `-created_at`)

**Response:** Array of video objects

### Get Videos by Type
```http
GET /api/videos/?type=cut
```

**Available Types:**
- `cut` - Video cuts/trailers
- `song` - Music videos
- `event` - Event videos
- `celebration` - Celebration videos
- `ads` - Advertisements

### Get Video by ID
```http
GET /api/videos/{id}/
```

**Response:** Single video object

---

## 🎵 Audio Songs Endpoints

### Get All Audio Songs
```http
GET /api/audio-songs/
```

**Query Parameters:**
- `search` - Search by title, artist, or music director
- `ordering` - Sort by field (e.g., `track_number`, `-plays`)
- `page` - Pagination

**Response:** Array of audio song objects

### Get Audio Song by ID
```http
GET /api/audio-songs/{id}/
```

**Response:** Single audio song object

---

## 📸 Photos Endpoints

### Get All Photo Folders
```http
GET /api/photos/folders/
```

**Query Parameters:**
- `type` - Filter by type: `movie`, `event`, `offline`
- `search` - Search by folder name
- `ordering` - Sort by name or creation date

**Response:**
```json
[
  {
    "id": 1,
    "name": "RRR",
    "slug": "rrr",
    "folder_type": "movie",
    "movie": 1,
    "description": "Photos from RRR...",
    "parent_folder": null,
    "photo_count": 25,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Folder by Slug (with nested photos)
```http
GET /api/photos/folders/{slug}/
```

**Response:**
```json
{
  "id": 1,
  "name": "RRR",
  "slug": "rrr",
  "folder_type": "movie",
  "movie": 1,
  "description": "Photos from RRR...",
  "parent_folder": null,
  "photos": [
    {
      "id": 1,
      "folder": 1,
      "image_url": "https://...",
      "thumbnail_url": "https://...",
      "caption": "Behind the scenes photo",
      "order": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Get Folder Subfolders
```http
GET /api/photos/folders/{slug}/subfolders/
```

**Response:** Array of subfolder objects

### Get All Photos
```http
GET /api/photos/
```

**Query Parameters:**
- `folder` - Filter by folder ID
- `search` - Search by caption
- `ordering` - Sort by order or creation date

**Response:** Array of photo objects

### Get Photos by Folder
```http
GET /api/photos/?folder={folder_id}
```

**Response:** Array of photo objects from specified folder

### Get Photo by ID
```http
GET /api/photos/{id}/
```

**Response:**
```json
{
  "id": 1,
  "folder": 1,
  "image_url": "https://...",
  "thumbnail_url": "https://...",
  "caption": "Photo caption",
  "order": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 400 Bad Request
```json
{
  "detail": "Invalid parameter value"
}
```

### 500 Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Common Query Examples

### Get RRR movie with all its data
```
GET /api/movies/rrr/
GET /api/movies/rrr/video-cuts/
GET /api/movies/rrr/video-songs/
GET /api/movies/rrr/audio-songs/
```

### Get all event videos
```
GET /api/videos/?type=event
```

### Search for songs
```
GET /api/audio-songs/?search=Naatu
```

### Get movie photos
```
GET /api/photos/folders/?type=movie
GET /api/photos/folders/rrr/
```

### Get photos from a specific folder
```
GET /api/photos/?folder=1
```

---

## Rate Limiting

No rate limiting is implemented in development. Production deployment should implement appropriate rate limiting.

## CORS

CORS is enabled for the following origins:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Alternative dev server)
- http://127.0.0.1:5173
- http://127.0.0.1:3000

Add your domain in production in `backend/config/settings.py`

---

## Authentication

Currently, all endpoints are open to public access (read-only).

Admin panel accessible at: `http://localhost:8000/admin`

---

## Tips for Frontend Integration

1. All endpoints support pagination - use `?page=2` for additional pages
2. Images may be null - use placeholder URLs as fallback
3. Always handle loading and error states in frontend
4. Use appropriate HTTP headers: `Content-Type: application/json`
5. Implement proper error handling for failed requests

---

**Last Updated:** 2024-01-01
**API Version:** 1.0.0
