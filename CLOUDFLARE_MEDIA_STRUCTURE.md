# Cloudflare R2 Media Structure — Complete Guide

## Bucket Name
`ntr-filmography`

## Complete Folder Hierarchy

```
ntr-filmography/                              # Root bucket
│
├── media/                                     # Base for MediaStorage
│   ├── movies/
│   │   ├── posters/{movie-slug}/
│   │   │   ├── poster.jpg                    # 1000×1500px (2:3)
│   │   │   └── poster_thumb.jpg              # 300×450px
│   │   │
│   │   └── banners/{movie-slug}/
│   │       ├── banner.jpg                    # 1920×1080px (16:9)
│   │       └── banner_thumb.jpg              # 600×340px
│   │
│   ├── photos/
│   │   ├── images/
│   │   │   ├── movie/{movie-slug}/{photo-id}/
│   │   │   │   ├── photo.jpg                 # Optimized (max 3000×3000)
│   │   │   │   └── {photo-id}_lg.jpg         # 1200×1200px max
│   │   │   ├── event/{folder-slug}/{photo-id}/
│   │   │   │   ├── photo.jpg
│   │   │   │   └── {photo-id}_lg.jpg
│   │   │   └── offline/{folder-slug}/{photo-id}/
│   │   │       ├── photo.jpg
│   │   │       └── {photo-id}_lg.jpg
│   │   │
│   │   └── thumbnails/
│   │       ├── movie/{movie-slug}/{photo-id}_thumb.jpg    # 400×400px
│   │       ├── event/{folder-slug}/{photo-id}_thumb.jpg
│   │       └── offline/{folder-slug}/{photo-id}_thumb.jpg
│   │
│   └── videos/thumbnails/{movie-slug}/
│       ├── {video-id}_cut_thumb.jpg       # 1280×720px (16:9)
│       ├── {video-id}_song_thumb.jpg
│       └── {video-id}_event_thumb.jpg
│
├── audio/{movie-slug}/
│   ├── album_art.jpg                       # 500×500px (1:1, optional)
│   └── cover_thumb.jpg                     # 200×200px
│
├── movies/
│   ├── posters/{movie-slug}/               # (MoviePosterStorage)
│   │   └── poster.jpg
│   └── banners/{movie-slug}/               # (MovieBannerStorage)
│       └── banner.jpg
│
├── photos/
│   ├── images/...                          # (PhotoImageStorage)
│   └── thumbnails/...                      # (PhotoThumbnailStorage)
│
└── videos/thumbnails/...                   # (VideoThumbnailStorage)
```

> **Note**: The actual upload path depends on the Django ImageField `upload_to` parameter. Django appends the `upload_to` path to the storage backend's `location`. For example:
> - `Movie.poster_image` has `upload_to='movies/posters/'` + `MoviePosterStorage.location = 'movies/posters'` → actual path: `media/movies/posters/{slug}/poster.jpg`
> - When using the generic `MediaStorage` (with `location='media'`), the path becomes `media/` + whatever `upload_to` specifies.

---

## Storage Backend Mapping

| Django Model | ImageField | u/l_to | Storage Class | R2 Location |
|---|---|---|---|---|
| Movie | poster_image | `movies/posters/` | MoviePosterStorage | `movies/posters/` |
| Movie | banner_image | `movies/banners/` | MovieBannerStorage | `movies/banners/` |
| Photo | image | `photos/` | PhotoImageStorage | `photos/images/` |
| Photo | thumbnail | `photos/thumbnails/` | PhotoThumbnailStorage | `photos/thumbnails/` |
| Video | thumbnail_image | `videos/thumbnails/` | VideoThumbnailStorage | `videos/thumbnails/` |

---

## Django Model Field → What Gets Stored

| Model.Field | Stores | Source | Example URL Stored in DB |
|---|---|---|---|
| Movie.poster_image | Image file | Admin upload | `movies/posters/rrr/poster.jpg` |
| Movie.banner_image | Image file | Admin upload | `movies/banners/rrr/banner.jpg` |
| Movie.poster_url | External URL | Seed/API | `https://cdn.example.com/movies/posters/rrr/poster.jpg` |
| Movie.banner_url | External URL | Seed/API | `https://cdn.example.com/movies/banners/rrr/banner.jpg` |
| Photo.image | Image file | Admin upload | `photos/images/movie/rrr/1/photo.jpg` |
| Photo.image_url | External URL | Seed/API | `https://cdn.example.com/photos/images/movie/rrr/1/photo.jpg` |
| Photo.thumbnail | Image file | Admin upload | `photos/thumbnails/movie/rrr/1_thumb.jpg` |
| Photo.thumbnail_url | External URL | Seed/API | `https://cdn.example.com/photos/thumbnails/movie/rrr/1_thumb.jpg` |
| Video.thumbnail_image | Image file | Admin upload | `videos/thumbnails/rrr/1_thumb.jpg` |
| Video.thumbnail_url | External URL | Seed/API | `https://cdn.example.com/videos/thumbnails/rrr/1_thumb.jpg` |
| Video.video_url | External URL | Admin/Seed | `https://www.youtube.com/embed/...` |
| AudioSong.audio_url | External URL | Admin/Seed | `https://www.soundcloud.com/...` |

---

## Image Size Specifications

| Image Type | Width × Height | Aspect Ratio | Format | Quality |
|---|---|---|---|---|
| Movie Poster (main) | 1000 × 1500 | 2∶3 | JPG | 85% |
| Movie Poster (thumb) | 300 × 450 | 2∶3 | JPG | 85% |
| Movie Banner (main) | 1920 × 1080 | 16∶9 | JPG | 85% |
| Movie Banner (thumb) | 600 × 340 | 16∶9 | JPG | 85% |
| Photo (original) | max 3000 × 3000 | Variable | JPG | 80% |
| Photo (large) | max 1200 × 1200 | Variable | JPG | 80% |
| Photo (thumbnail) | 400 × 400 | 1∶1 (crop) | JPG | 80% |
| Video Thumbnail | 1280 × 720 | 16∶9 | JPG | 85% |
| Album Art (main) | 500 × 500 | 1∶1 | JPG | 85% |
| Album Art (thumb) | 200 × 200 | 1∶1 | JPG | 85% |

---

## How the Frontend Uses These URLs

The frontend displays media via **either**:
1. **`_url` fields** (e.g., `poster_url`, `image_url`, `thumbnail_url`) — direct URLs stored in the database
2. **`_image` fields** (e.g., `poster_image`, `image`) — If using Cloudflare R2, Django generates the URL from the image field path

The frontend code currently checks:
```js
// If it's a placeholder URL → replace with local sample image
const isPlaceholderUrl = (url) => !url || url.includes('via.placeholder.com');
const displayUrl = isPlaceholderUrl(video.thumbnail_url) ? fallbackImage : video.thumbnail_url;
```

**For production with Cloudflare R2:**
- Upload real images via Django Admin → Cloudflare R2
- The `_image` fields will generate real URLs from R2
- Update `_url` fields to point to R2 CDN URLs (e.g., `https://cdn.ntr-filmography.com/...`)
- Remove `isPlaceholderUrl` checks from frontend once real images are loaded

---

## Setup Checklist for Cloudflare R2

### Step 1: Create Resources
- [ ] Create R2 bucket named `ntr-filmography`
- [ ] Generate API token with read/write permission
- [ ] (Optional) Set up custom domain `cdn.ntr-filmography.com`

### Step 2: Configure Django `.env`
```env
USE_CLOUDFLARE_R2=True
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET=ntr-filmography
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_CUSTOM_DOMAIN=https://cdn.ntr-filmography.com
```

### Step 3: Upload Media via Django Admin
- **Movies**: Go to `/admin/movies/movie/` → upload poster & banner for each movie
- **Videos**: Go to `/admin/videos/video/` → upload thumbnail for each video
- **Photos**: Go to `/admin/photos/photofolder/` → create folders → `/admin/photos/photo/` → upload images
- **Audio**: Album art can be added directly to R2 at `audio/{movie-slug}/`

### Step 4: Direct Upload via CLI (Alternative)
```bash
# Using AWS CLI (S3-compatible)
aws s3 cp poster.jpg s3://ntr-filmography/movies/posters/rrr/poster.jpg \
  --endpoint-url https://[account-id].r2.cloudflarestorage.com

# Using Cloudflare Wrangler
wrangler r2 object create ntr-filmography/movies/posters/rrr/poster.jpg --file ./poster.jpg
```

### Step 5: Update Frontend
- Once `poster_url` / `thumbnail_url` fields contain real R2 URLs, remove placeholder fallback logic
- The frontend will serve images directly from Cloudflare CDN

---

## Folder Creation Strategy

The recommended approach for creating folders and uploading at scale:

```
# media/ directory (local) → R2 bucket (remote)
# Mirror the same structure:

local_media/
├── movies/posters/rrr/poster.jpg
├── movies/banners/devara/banner.jpg
├── photos/images/movie/simhadri/1.jpg
├── photos/thumbnails/movie/simhadri/1_thumb.jpg
├── videos/thumbnails/rrr/trailer_thumb.jpg
└── audio/rrr/album_art.jpg

# Bulk upload script:

aws s3 sync ./media/ s3://ntr-filmography/media/ \
  --endpoint-url https://[account-id].r2.cloudflarestorage.com
```

This sync command will preserve the exact folder structure and upload everything in one go.
