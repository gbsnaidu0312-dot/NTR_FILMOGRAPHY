# ✅ Cloudflare R2 Storage Setup Summary

## What's Been Configured

### 1. **Storage Backend** (`config/storage.py`)
- Created custom Cloudflare R2 storage class
- Specialized storage classes for different media types:
  - `MoviePosterStorage` → `movies/posters/`
  - `MovieBannerStorage` → `movies/banners/`
  - `PhotoImageStorage` → `photos/images/`
  - `PhotoThumbnailStorage` → `photos/thumbnails/`
  - `VideoThumbnailStorage` → `videos/thumbnails/`
  - `AudioStorage` → `audio/`

### 2. **Django Configuration** (`config/settings.py`)
- Conditional storage selection:
  - `USE_CLOUDFLARE_R2=True` → Use Cloudflare R2
  - `USE_CLOUDFLARE_R2=False` → Use local storage (development)
- All configuration in environment variables via `.env`

### 3. **Dependencies** (`requirements.txt`)
- ✅ `boto3==1.28.85` - AWS S3 SDK (works with Cloudflare R2)
- ✅ `django-storages==1.14.2` - Django storage backends

### 4. **Environment Configuration** (`.env.example`)
Updated with:
```env
USE_CLOUDFLARE_R2=True/False
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET=ntr-filmography
CLOUDFLARE_R2_ENDPOINT=...
CLOUDFLARE_R2_CUSTOM_DOMAIN=...
```

### 5. **Documentation**
- `CLOUDFLARE_MEDIA_GUIDE.md` - Complete setup and usage guide
- `MEDIA_UPLOAD_QUICK_REFERENCE.md` - Quick reference for uploads

## 📁 Folder Structure in R2

```
ntr-filmography/
├── movies/
│   ├── posters/{movie-slug}/poster.jpg
│   └── banners/{movie-slug}/banner.jpg
├── photos/
│   ├── images/{type}/{folder-slug}/{photo-id}/photo.jpg
│   └── thumbnails/{type}/{folder-slug}/{photo-id}_thumb.jpg
├── videos/
│   └── thumbnails/{type}/{id}/{video-id}_thumb.jpg
└── audio/
    └── {movie-slug}/album_art.jpg
```

## 🚀 Next Steps

### 1. Enable Cloudflare R2 Storage
Update your `.env` file:
```env
USE_CLOUDFLARE_R2=True
CLOUDFLARE_R2_ACCESS_KEY_ID=your-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret
CLOUDFLARE_R2_BUCKET=ntr-filmography
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_CUSTOM_DOMAIN=https://cdn.ntr-filmography.com
```

### 2. Get Cloudflare Credentials
1. Go to https://dash.cloudflare.com/
2. Create R2 bucket: `ntr-filmography`
3. Create API token with R2 permissions
4. Copy S3 endpoint URL

### 3. Restart Django Server
```bash
cd backend
python manage.py runserver
```

### 4. Upload Media via Admin
- Visit http://localhost:8000/admin
- Movies: Upload posters & banners
- Photos: Upload images & thumbnails
- Videos: Upload thumbnails
- All files auto-saved to Cloudflare R2!

## 🎯 Features

✅ **Automatic Path Organization** - Files organized by type/movie/category  
✅ **Custom Domain Support** - Use your own CDN domain  
✅ **Public Access** - All media is publicly readable  
✅ **Easy Management** - Control via Django Admin or CLI  
✅ **Development Friendly** - Switch between local and cloud storage with one setting  
✅ **Image Optimization** - GZIP compression for assets  

## 🔑 Key Files Modified

| File | Changes |
|------|---------|
| `config/storage.py` | New file - Storage backends |
| `config/settings.py` | Added Cloudflare R2 config |
| `requirements.txt` | Added boto3 & django-storages |
| `.env.example` | Updated with R2 credentials |

## 💾 Model Fields Using Storage

### Movies
- `poster_image` → Cloudflare R2
- `banner_image` → Cloudflare R2
- `poster_url` → External URL (unchanged)
- `banner_url` → External URL (unchanged)

### Photos
- `image` → Cloudflare R2
- `thumbnail` → Cloudflare R2
- `image_url` → External URL (unchanged)
- `thumbnail_url` → External URL (unchanged)

### Videos
- `thumbnail_image` → Cloudflare R2
- `video_url` → External URL (unchanged)
- `thumbnail_url` → External URL (unchanged)

### Audio
- `audio_url` → External URL (unchanged)

## 🛠️ Management Commands

Run database migrations if you change storage:
```bash
python manage.py migrate
```

No new migrations needed - existing fields work with new storage!

## 📊 Bandwidth & Costs

- **Cloudflare R2**: $0.015 per GB stored, $0.20 per million requests
- **Cloudflare Workers**: Free tier available
- **Custom Domain**: Free with Cloudflare

## 🆘 Support

For detailed information, refer to:
- [Cloudflare Media Guide](CLOUDFLARE_MEDIA_GUIDE.md)
- [Quick Reference](MEDIA_UPLOAD_QUICK_REFERENCE.md)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
