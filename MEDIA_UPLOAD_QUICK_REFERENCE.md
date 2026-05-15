# 🎬 Media Upload Quick Reference

## Cloudflare R2 Folder Structure Overview

```
ntr-filmography/ (your bucket)
│
├── movies/
│   ├── posters/{movie-slug}/
│   │   ├── poster.jpg (1000x1500px)
│   │   └── poster_thumb.jpg (300x450px)
│   └── banners/{movie-slug}/
│       ├── banner.jpg (1920x1080px)
│       └── banner_thumb.jpg (600x340px)
│
├── photos/
│   ├── images/{type}/{folder-slug}/{photo-id}/
│   │   ├── photo.jpg (up to 3000x3000px)
│   │   └── {photo-id}_lg.jpg (max 1200x1200px)
│   └── thumbnails/{type}/{folder-slug}/
│       └── {photo-id}_thumb.jpg (400x400px)
│
├── videos/
│   └── thumbnails/{type}/{movie-slug-or-id}/
│       └── {video-id}_thumb.jpg (1280x720px)
│
└── audio/
    └── {movie-slug}/
        ├── album_art.jpg (500x500px)
        └── cover_thumb.jpg (200x200px)
```

## Image Size Requirements

| Media Type | Resolution | Format | Quality |
|-----------|-----------|---------|---------|
| **Movie Poster** | 1000x1500px | JPG | 85% |
| **Movie Poster Thumb** | 300x450px | JPG | 85% |
| **Movie Banner** | 1920x1080px | JPG | 85% |
| **Banner Thumb** | 600x340px | JPG | 85% |
| **Photo (Original)** | ≤3000x3000px | JPG | 80% |
| **Photo Large** | ≤1200x1200px | JPG | 80% |
| **Photo Thumb** | 400x400px | JPG | 80% |
| **Video Thumb** | 1280x720px | JPG | 85% |
| **Album Art** | 500x500px | JPG | 85% |
| **Album Art Thumb** | 200x200px | JPG | 85% |

## Setup Steps

### 1️⃣ Create Cloudflare R2 Bucket
- Go to https://dash.cloudflare.com/ → **R2**
- Click **Create Bucket**
- Name: `ntr-filmography`
- Click **Create**

### 2️⃣ Create API Token
- Go to **Account Settings** → **API Tokens**
- Click **Create Token**
- Name: `NTR Filmography R2`
- Permissions: **Edit** for `com.cloudflare.edge.r2.bucket.content.*`
- Select your bucket
- Copy and save credentials

### 3️⃣ Get S3 Endpoint
- Go to **R2** → **Bucket Settings**
- Copy the **S3 API Endpoint** (looks like: `https://[account-id].r2.cloudflarestorage.com`)

### 4️⃣ Set Up Custom Domain (Optional)
- In **Bucket Settings** → **Custom Domains**
- Add your custom domain
- Update DNS records

### 5️⃣ Update Django Configuration
Create/edit `.env` in `backend/`:
```env
USE_CLOUDFLARE_R2=True
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET=ntr-filmography
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_CUSTOM_DOMAIN=https://cdn.ntr-filmography.com
```

### 6️⃣ Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

## Uploading Media

### Via Django Admin
1. Go to http://localhost:8000/admin
2. Navigate to Movies/Photos/Videos
3. Upload images → Auto-saved to correct R2 folders
4. All URLs automatically point to Cloudflare CDN

### Via AWS CLI
```bash
# Configure
aws configure
# Set:
# AWS Access Key ID: your-access-key-id
# AWS Secret Access Key: your-secret-access-key
# Default region: auto

# Upload file
aws s3 cp poster.jpg s3://ntr-filmography/movies/posters/rrr/poster.jpg \
  --endpoint-url https://[account-id].r2.cloudflarestorage.com
```

### Via Wrangler CLI
```bash
# Install: npm install -g wrangler

# Upload
wrangler r2 object create ntr-filmography/movies/posters/rrr/poster.jpg \
  --file ./poster.jpg
```

## Folder Naming Conventions

- **Movie Slug**: Lowercase, hyphens instead of spaces (e.g., `rrr`, `charan-16`)
- **Photo Type**: `movie`, `event`, or `offline`
- **Video Type**: `movie`, `event`, `celebration`, `ads`
- **File Names**: Lowercase with hyphens (e.g., `poster.jpg`, `banner_thumb.jpg`)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 403 Error on Upload | Check API credentials, verify bucket name |
| Images Not Loading | Check CORS settings, verify custom domain setup |
| Slow Performance | Use custom domain CDN, optimize images first |
| Missing Files | Check folder structure matches convention |

## File Naming Examples

### Movies (RRR)
```
movies/posters/rrr/poster.jpg
movies/posters/rrr/poster_thumb.jpg
movies/banners/rrr/banner.jpg
movies/banners/rrr/banner_thumb.jpg
```

### Photos (From RRR Movie)
```
photos/images/movie/rrr/photo-1/photo.jpg
photos/images/movie/rrr/photo-1/photo-1_lg.jpg
photos/thumbnails/movie/rrr/photo-1_thumb.jpg
```

### Videos (From RRR)
```
videos/thumbnails/movie/rrr/cut-1_thumb.jpg
videos/thumbnails/movie/rrr/song-1_thumb.jpg
```

---

For detailed information, see [CLOUDFLARE_MEDIA_GUIDE.md](CLOUDFLARE_MEDIA_GUIDE.md)
