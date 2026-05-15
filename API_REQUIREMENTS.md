# API Requirements — Frontend ↔ Backend Mapping

## Legend
| Column | Description |
|--------|-------------|
| **Page** | Frontend route |
| **API Endpoint** | Full URL path |
| **Method** | HTTP method |
| **Purpose** | What the frontend uses this for |
| **Request Params** | Query or path parameters |
| **Response Fields** | Key fields the frontend expects |

---

## 1. Movies

### 1.1 Movie List
| | |
|---|---|
| **Page** | `/movies` |
| **API Endpoint** | `GET /api/movies/` |
| **Method** | GET |
| **Purpose** | Load all movies for filmstrip & grid view |
| **Request Params** | `?page=1` (paginated, 50 per page) |
| **Response Fields** | `id`, `title`, `slug`, `release_year`, `poster_url`, `genre` |

### 1.2 Movie Detail
| | |
|---|---|
| **Page** | `/movies/:slug` |
| **API Endpoint** | `GET /api/movies/{slug}/` |
| **Method** | GET |
| **Purpose** | Load single movie detail page |
| **Request Params** | Path: `slug` |
| **Response Fields** | `id`, `title`, `slug`, `release_year`, `description`, `poster_url`, `banner_url`, `duration_minutes`, `genre`, `director`, `box_office`, `poster_image`, `banner_image` |

### 1.3 Movie Video Cuts
| | |
|---|---|
| **Page** | `/video-cuts` *(also `/movies/:slug`)* |
| **API Endpoint** | `GET /api/movies/{slug}/video-cuts/` |
| **Method** | GET |
| **Purpose** | Get all video cuts (trailers, teasers, BTS) for a specific movie |
| **Request Params** | Path: `slug` |
| **Response Fields** | Array of: `id`, `movie`, `title`, `video_type`, `video_url`, `thumbnail_url`, `duration_seconds`, `views`, `description` |

### 1.4 Movie Video Songs
| | |
|---|---|
| **Page** | `/video-cuts` *(also `/movies/:slug`)* |
| **API Endpoint** | `GET /api/movies/{slug}/video-songs/` |
| **Method** | GET |
| **Purpose** | Get all video songs for a specific movie |
| **Request Params** | Path: `slug` |
| **Response Fields** | Same as video-cuts but `video_type='song'` |

### 1.5 Movie Audio Songs
| | |
|---|---|
| **Page** | `/movies/:slug` |
| **API Endpoint** | `GET /api/movies/{slug}/audio-songs/` |
| **Method** | GET |
| **Purpose** | Load audio playlist for a movie |
| **Request Params** | Path: `slug` |
| **Response Fields** | Array of: `id`, `movie`, `title`, `artist`, `music_director`, `audio_url`, `duration_seconds`, `track_number`, `plays`, `description` |

### 1.6 Movie Search
| | |
|---|---|
| **Page** | `/movies` |
| **API Endpoint** | `GET /api/movies/?search={query}` |
| **Method** | GET |
| **Purpose** | Search movies by title or description |
| **Request Params** | `?search=query` |
| **Response Fields** | Same as movie list (paginated) |

---

## 2. Videos

### 2.1 Video List (filtered by type)
| | |
|---|---|
| **Page** | `/video-cuts`, `/videos` |
| **API Endpoint** | `GET /api/videos/?type={type}` |
| **Method** | GET |
| **Purpose** | Load videos filtered by type (cut, song, event, celebration, ads) |
| **Request Params** | `?type=cut|song|event|celebration`, `?movie=ID` |
| **Response Fields** | `id`, `title`, `video_type`, `thumbnail_url`, `duration_seconds`, `views` |

### 2.2 Video Detail
| | |
|---|---|
| **Page** | *(modal on video pages)* |
| **API Endpoint** | `GET /api/videos/{id}/` |
| **Method** | GET |
| **Purpose** | Load full video details for lightbox player |
| **Request Params** | Path: `id` |
| **Response Fields** | `id`, `movie`, `title`, `video_type`, `video_url`, `thumbnail_url`, `duration_seconds`, `views`, `description` |

### 2.3 Video Search
| | |
|---|---|
| **Page** | `/video-cuts`, `/videos` |
| **API Endpoint** | `GET /api/videos/?search={query}` |
| **Method** | GET |
| **Purpose** | Search videos by title or description |
| **Request Params** | `?search=query` |
| **Response Fields** | Same as video list |

---

## 3. Audio Songs

### 3.1 All Audio Songs
| | |
|---|---|
| **Page** | `/movies` |
| **API Endpoint** | `GET /api/audio-songs/` |
| **Method** | GET |
| **Purpose** | Load all audio songs (for global player) |
| **Request Params** | `?page=1` |
| **Response Fields** | `id`, `title`, `artist`, `track_number`, `duration_seconds`, `plays` |

### 3.2 Audio Song Detail
| | |
|---|---|
| **Page** | *(modal / player)* |
| **API Endpoint** | `GET /api/audio-songs/{id}/` |
| **Method** | GET |
| **Purpose** | Load full details for a single audio song |
| **Request Params** | Path: `id` |
| **Response Fields** | `id`, `movie`, `title`, `artist`, `music_director`, `audio_url`, `duration_seconds`, `track_number`, `plays`, `description` |

### 3.3 Audio Song Search
| | |
|---|---|
| **Page** | `/movies` |
| **API Endpoint** | `GET /api/audio-songs/?search={query}` |
| **Method** | GET |
| **Purpose** | Search audio by title, artist, or music director |
| **Request Params** | `?search=query` |
| **Response Fields** | Same as audio song list |

---

## 4. Photos

### 4.1 Photo Folders (by type)
| | |
|---|---|
| **Page** | `/photos` |
| **API Endpoint** | `GET /api/photos/folders/?type={type}` |
| **Method** | GET |
| **Purpose** | Load folders filtered by category (movie, event, offline) |
| **Request Params** | `?type=movie|event|offline` |
| **Response Fields** | Array of: `id`, `name`, `slug`, `folder_type`, `movie`, `description`, `parent_folder`, `photo_count` |

### 4.2 Photo Folder Detail (with photos)
| | |
|---|---|
| **Page** | `/photos` |
| **API Endpoint** | `GET /api/photos/folders/{slug}/` |
| **Method** | GET |
| **Purpose** | Load a single folder with all its nested photos |
| **Request Params** | Path: `slug` |
| **Response Fields** | `id`, `name`, `slug`, `folder_type`, `movie`, `description`, `parent_folder`, `photos[]` (each with: `id`, `folder`, `image_url`, `thumbnail_url`, `caption`, `order`) |

### 4.3 Photo Folder Subfolders
| | |
|---|---|
| **Page** | `/photos` |
| **API Endpoint** | `GET /api/photos/folders/{slug}/subfolders/` |
| **Method** | GET |
| **Purpose** | Get subfolders inside a parent folder |
| **Request Params** | Path: `slug` |
| **Response Fields** | Array of folder objects (same as folder list) |

### 4.4 All Photos
| | |
|---|---|
| **Page** | `/photos` |
| **API Endpoint** | `GET /api/photos/` |
| **Method** | GET |
| **Purpose** | Browse all photos (optionally filtered by folder) |
| **Request Params** | `?folder=ID` |
| **Response Fields** | Array of: `id`, `folder`, `image_url`, `thumbnail_url`, `caption`, `order` |

### 4.5 Photo Detail
| | |
|---|---|
| **Page** | *(lightbox on photos page)* |
| **API Endpoint** | `GET /api/photos/{id}/` |
| **Method** | GET |
| **Purpose** | Load single photo full data |
| **Request Params** | Path: `id` |
| **Response Fields** | `id`, `folder`, `image_url`, `thumbnail_url`, `caption`, `order` |

---

## 5. Admin (Django Built-in)

| Page | Endpoint | Purpose |
|------|----------|---------|
| Admin Login | `GET /admin/login/` | Admin authentication |
| Movies Admin | `GET /admin/movies/movie/` | CRUD for movies + upload poster/banner |
| Videos Admin | `GET /admin/videos/video/` | CRUD for videos + upload thumbnail |
| Audio Admin | `GET /admin/audio/audiosong/` | CRUD for audio songs |
| Photos Folders | `GET /admin/photos/photofolder/` | CRUD for photo folders |
| Photos | `GET /admin/photos/photo/` | CRUD for photos + upload images |

---

## Summary: What Each Page Needs

| Frontend Route | API Calls Made |
|---|---|
| `/` | *(none — uses static assets only)* |
| `/movies` | `GET /api/movies/`, `GET /api/audio-songs/` |
| `/movies/:slug` | `GET /api/movies/{slug}/`, `GET /api/movies/{slug}/audio-songs/` |
| `/photos` | `GET /api/photos/folders/?type=...`, `GET /api/photos/folders/{slug}/` |
| `/video-cuts` | `GET /api/movies/`, `GET /api/videos/?type=cut|song` |
| `/videos` | `GET /api/videos/?type=event|celebration` |
