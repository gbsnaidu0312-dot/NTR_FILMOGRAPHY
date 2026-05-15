#!/bin/bash

# NTR Filmography API - cURL Examples
# Base URL: http://localhost:8000/api
# Documentation: Use these examples to test the API endpoints

BASE_URL="http://localhost:8000/api"
HEADER="Content-Type: application/json"

echo "=== NTR FILMOGRAPHY API - CURL EXAMPLES ==="
echo ""
echo "Base URL: $BASE_URL"
echo ""

# ============================================
# MOVIES ENDPOINTS
# ============================================
echo "📽️  MOVIES ENDPOINTS"
echo "===================="
echo ""

echo "# 1. Get All Movies (with pagination - 50 per page)"
echo "curl -X GET \"$BASE_URL/movies/\" -H \"$HEADER\""
echo ""

echo "# 2. Get Specific Movie by Slug"
echo "curl -X GET \"$BASE_URL/movies/rrr/\" -H \"$HEADER\""
echo ""

echo "# 3. Search Movies by Title"
echo "curl -X GET \"$BASE_URL/movies/?search=RRR\" -H \"$HEADER\""
echo ""

echo "# 4. Get Movie Video Cuts"
echo "curl -X GET \"$BASE_URL/movies/rrr/video-cuts/\" -H \"$HEADER\""
echo ""

echo "# 5. Get Movie Video Songs"
echo "curl -X GET \"$BASE_URL/movies/rrr/video-songs/\" -H \"$HEADER\""
echo ""

echo "# 6. Get Movie Audio Songs"
echo "curl -X GET \"$BASE_URL/movies/rrr/audio-songs/\" -H \"$HEADER\""
echo ""

# ============================================
# VIDEOS ENDPOINTS
# ============================================
echo "🎬 VIDEOS ENDPOINTS"
echo "==================="
echo ""

echo "# 1. Get All Videos"
echo "curl -X GET \"$BASE_URL/videos/\" -H \"$HEADER\""
echo ""

echo "# 2. Get Videos by Type (cut)"
echo "curl -X GET \"$BASE_URL/videos/?type=cut\" -H \"$HEADER\""
echo ""

echo "# 3. Get Event Videos"
echo "curl -X GET \"$BASE_URL/videos/?type=event\" -H \"$HEADER\""
echo ""

echo "# 4. Get Celebration Videos"
echo "curl -X GET \"$BASE_URL/videos/?type=celebration\" -H \"$HEADER\""
echo ""

echo "# 5. Get Advertisement Videos"
echo "curl -X GET \"$BASE_URL/videos/?type=ads\" -H \"$HEADER\""
echo ""

echo "# 6. Search Videos"
echo "curl -X GET \"$BASE_URL/videos/?search=Trailer\" -H \"$HEADER\""
echo ""

echo "# 7. Get Specific Video by ID"
echo "curl -X GET \"$BASE_URL/videos/1/\" -H \"$HEADER\""
echo ""

echo "# 8. Sort Videos by Views (descending)"
echo "curl -X GET \"$BASE_URL/videos/?ordering=-views\" -H \"$HEADER\""
echo ""

# ============================================
# AUDIO SONGS ENDPOINTS
# ============================================
echo "🎵 AUDIO SONGS ENDPOINTS"
echo "========================"
echo ""

echo "# 1. Get All Audio Songs (with pagination)"
echo "curl -X GET \"$BASE_URL/audio-songs/\" -H \"$HEADER\""
echo ""

echo "# 2. Get Specific Audio Song by ID"
echo "curl -X GET \"$BASE_URL/audio-songs/1/\" -H \"$HEADER\""
echo ""

echo "# 3. Search Audio Songs by Title"
echo "curl -X GET \"$BASE_URL/audio-songs/?search=Naatu\" -H \"$HEADER\""
echo ""

echo "# 4. Search by Artist Name"
echo "curl -X GET \"$BASE_URL/audio-songs/?search=Kaala+Bhairava\" -H \"$HEADER\""
echo ""

echo "# 5. Sort by Track Number"
echo "curl -X GET \"$BASE_URL/audio-songs/?ordering=track_number\" -H \"$HEADER\""
echo ""

echo "# 6. Sort by Plays (descending)"
echo "curl -X GET \"$BASE_URL/audio-songs/?ordering=-plays\" -H \"$HEADER\""
echo ""

# ============================================
# PHOTOS ENDPOINTS
# ============================================
echo "📸 PHOTOS ENDPOINTS"
echo "==================="
echo ""

echo "# 1. Get All Photo Folders"
echo "curl -X GET \"$BASE_URL/photos/folders/\" -H \"$HEADER\""
echo ""

echo "# 2. Get Movie Photo Folders"
echo "curl -X GET \"$BASE_URL/photos/folders/?type=movie\" -H \"$HEADER\""
echo ""

echo "# 3. Get Event Photo Folders"
echo "curl -X GET \"$BASE_URL/photos/folders/?type=event\" -H \"$HEADER\""
echo ""

echo "# 4. Get Offline Photo Folders"
echo "curl -X GET \"$BASE_URL/photos/folders/?type=offline\" -H \"$HEADER\""
echo ""

echo "# 5. Get Specific Folder by Slug (with nested photos)"
echo "curl -X GET \"$BASE_URL/photos/folders/rrr/\" -H \"$HEADER\""
echo ""

echo "# 6. Get Folder Subfolders"
echo "curl -X GET \"$BASE_URL/photos/folders/events/subfolders/\" -H \"$HEADER\""
echo ""

echo "# 7. Get All Photos"
echo "curl -X GET \"$BASE_URL/photos/\" -H \"$HEADER\""
echo ""

echo "# 8. Get Photos from Specific Folder by ID"
echo "curl -X GET \"$BASE_URL/photos/?folder=1\" -H \"$HEADER\""
echo ""

echo "# 9. Get Specific Photo by ID"
echo "curl -X GET \"$BASE_URL/photos/1/\" -H \"$HEADER\""
echo ""

echo "# 10. Search Photo Folders by Name"
echo "curl -X GET \"$BASE_URL/photos/folders/?search=Awards\" -H \"$HEADER\""
echo ""

# ============================================
# HELPER FUNCTIONS
# ============================================
echo ""
echo "✨ OPTIONAL: Define these functions to simplify requests"
echo "=========================================================="
echo ""
echo "# Add this to your .bashrc or .zshrc:"
echo ""
echo "get_movies() { curl -s \"$BASE_URL/movies/\" | jq '.'; }"
echo "get_movie() { curl -s \"$BASE_URL/movies/\$1/\" | jq '.'; }"
echo "get_videos() { curl -s \"$BASE_URL/videos/?type=\${1:-cut}\" | jq '.'; }"
echo "get_audio() { curl -s \"$BASE_URL/audio-songs/\" | jq '.'; }"
echo "get_photos() { curl -s \"$BASE_URL/photos/\" | jq '.'; }"
echo ""

# Uncomment below to execute actual requests
# echo ""
# echo "🔍 Testing API..."
# echo ""
# echo "Getting all movies..."
# curl -s "$BASE_URL/movies/" | jq '.' | head -20
# echo ""
curl -X GET "http://localhost:8000/api/movies/rrr/video-cuts/" \
  -H "Content-Type: application/json"

# Get video songs for a movie
curl -X GET "http://localhost:8000/api/movies/rrr/video-songs/" \
  -H "Content-Type: application/json"

# Get audio songs for a movie
curl -X GET "http://localhost:8000/api/movies/rrr/audio-songs/" \
  -H "Content-Type: application/json"

# ============================================
# VIDEO ENDPOINTS
# ============================================

# Get all videos
curl -X GET "http://localhost:8000/api/videos/" \
  -H "Content-Type: application/json"

# Get videos by type (cut, song, event, celebration, ads)
curl -X GET "http://localhost:8000/api/videos/?type=cut" \
  -H "Content-Type: application/json"

# Get event videos
curl -X GET "http://localhost:8000/api/videos/?type=event" \
  -H "Content-Type: application/json"

# Get celebration videos
curl -X GET "http://localhost:8000/api/videos/?type=celebration" \
  -H "Content-Type: application/json"

# Search videos
curl -X GET "http://localhost:8000/api/videos/?search=teaser" \
  -H "Content-Type: application/json"

# Sort videos by views (descending)
curl -X GET "http://localhost:8000/api/videos/?ordering=-views" \
  -H "Content-Type: application/json"

# ============================================
# AUDIO SONGS ENDPOINTS
# ============================================

# Get all audio songs
curl -X GET "http://localhost:8000/api/audio-songs/" \
  -H "Content-Type: application/json"

# Get audio song by ID
curl -X GET "http://localhost:8000/api/audio-songs/1/" \
  -H "Content-Type: application/json"

# Search audio songs by artist or title
curl -X GET "http://localhost:8000/api/audio-songs/?search=chuttamalle" \
  -H "Content-Type: application/json"

# Sort audio songs by track number
curl -X GET "http://localhost:8000/api/audio-songs/?ordering=track_number" \
  -H "Content-Type: application/json"

# ============================================
# PHOTOS ENDPOINTS
# ============================================

# Get all photo folders
curl -X GET "http://localhost:8000/api/photos/folders/" \
  -H "Content-Type: application/json"

# Get photo folders by type
curl -X GET "http://localhost:8000/api/photos/folders/?type=movie" \
  -H "Content-Type: application/json"

# Get event photo folders
curl -X GET "http://localhost:8000/api/photos/folders/?type=event" \
  -H "Content-Type: application/json"

# Get offline photo folders
curl -X GET "http://localhost:8000/api/photos/folders/?type=offline" \
  -H "Content-Type: application/json"

# Get specific folder with photos
curl -X GET "http://localhost:8000/api/photos/folders/aadi/" \
  -H "Content-Type: application/json"

# Get subfolders of a folder
curl -X GET "http://localhost:8000/api/photos/folders/movie-events/subfolders/" \
  -H "Content-Type: application/json"

# Get all photos
curl -X GET "http://localhost:8000/api/photos/" \
  -H "Content-Type: application/json"

# Get photos from specific folder
curl -X GET "http://localhost:8000/api/photos/?folder=1" \
  -H "Content-Type: application/json"

# ============================================
# PAGINATION EXAMPLES
# ============================================

# Get page 2 of movies (50 per page by default)
curl -X GET "http://localhost:8000/api/movies/?page=2" \
  -H "Content-Type: application/json"

# ============================================
# SEARCH AND FILTER EXAMPLES
# ============================================

# Search movies by title or description
curl -X GET "http://localhost:8000/api/movies/?search=action" \
  -H "Content-Type: application/json"

# Search photo folders by name
curl -X GET "http://localhost:8000/api/photos/folders/?search=aadi" \
  -H "Content-Type: application/json"

# ============================================
# RESPONSE EXAMPLES
# ============================================

# Sample Movie Response:
# {
#   "id": 1,
#   "title": "RRR",
#   "slug": "rrr",
#   "release_year": 2022,
#   "description": "Two Indian revolutionaries...",
#   "poster_url": "https://via.placeholder.com/300x450?text=RRR",
#   "banner_url": "https://via.placeholder.com/1920x1080?text=RRR+Banner",
#   "duration_minutes": 187,
#   "genre": "Action, Drama",
#   "director": "S. S. Rajamouli",
#   "box_office": "$140M+",
#   "created_at": "2024-01-15T10:30:00Z",
#   "updated_at": "2024-01-15T10:30:00Z"
# }

# Sample Video Response:
# {
#   "id": 1,
#   "movie": 1,
#   "title": "RRR - Action Teaser",
#   "video_type": "cut",
#   "video_url": "https://www.youtube.com/embed/placeholder0",
#   "thumbnail_url": "https://via.placeholder.com/400x225?text=Action+Teaser",
#   "duration_seconds": 120,
#   "views": 1000,
#   "description": "",
#   "created_at": "2024-01-15T10:30:00Z",
#   "updated_at": "2024-01-15T10:30:00Z"
# }

# Sample Audio Song Response:
# {
#   "id": 1,
#   "movie": 1,
#   "title": "Chuttamalle",
#   "artist": "Kaala Bhairava",
#   "music_director": "MM Keeravani",
#   "audio_url": "https://www.soundcloud.com/placeholder1",
#   "duration_seconds": 240,
#   "track_number": 1,
#   "plays": 5000,
#   "description": "",
#   "created_at": "2024-01-15T10:30:00Z",
#   "updated_at": "2024-01-15T10:30:00Z"
# }

# Sample Photo Folder Response:
# {
#   "id": 1,
#   "name": "Aadi",
#   "slug": "aadi",
#   "folder_type": "movie",
#   "movie": 3,
#   "description": "Photo gallery for Aadi",
#   "parent_folder": null,
#   "photo_count": 5,
#   "created_at": "2024-01-15T10:30:00Z",
#   "updated_at": "2024-01-15T10:30:00Z"
# }

# Sample Photo Response:
# {
#   "id": 1,
#   "folder": 1,
#   "image_url": "https://via.placeholder.com/800x600?text=Aadi+Photo+1",
#   "thumbnail_url": "https://via.placeholder.com/400x300?text=Aadi+1",
#   "caption": "Photo 1 from Aadi",
#   "order": 1,
#   "created_at": "2024-01-15T10:30:00Z",
#   "updated_at": "2024-01-15T10:30:00Z"
# }
