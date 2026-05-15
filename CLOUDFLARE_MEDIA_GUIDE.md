# Cloudflare R2 Media Upload Guide

## 📁 Folder Structure in Cloudflare R2

This is the complete folder structure for organizing all media files in your Cloudflare R2 bucket:

```
ntr-filmography/                          # Root bucket
├── movies/
│   ├── posters/
│   │   └── {movie-slug}/
│   │       ├── poster.jpg               # Main poster (1000x1500px)
│   │       └── poster_thumb.jpg         # Thumbnail (300x450px)
│   │
│   └── banners/
│       └── {movie-slug}/
│           ├── banner.jpg               # Main banner (1920x1080px)
│           └── banner_thumb.jpg         # Thumbnail (600x340px)
│
├── photos/
│   ├── images/
│   │   ├── movie/
│   │   │   └── {movie-slug}/{photo-id}/
│   │   │       ├── photo.jpg            # Original photo
│   │   │       └── {photo-id}_lg.jpg    # Large version
│   │   ├── event/
│   │   │   └── {folder-slug}/{photo-id}/
│   │   │       ├── photo.jpg
│   │   │       └── {photo-id}_lg.jpg
│   │   └── offline/
│   │       └── {folder-slug}/{photo-id}/
│   │           ├── photo.jpg
│   │           └── {photo-id}_lg.jpg
│   │
│   └── thumbnails/
│       ├── movie/
│       │   └── {movie-slug}/{photo-id}_thumb.jpg
│       ├── event/
│       │   └── {folder-slug}/{photo-id}_thumb.jpg
│       └── offline/
│           └── {folder-slug}/{photo-id}_thumb.jpg
│
├── videos/
│   └── thumbnails/
│       ├── movie/{movie-slug}/
│       │   ├── {video-id}_cut_thumb.jpg
│       │   ├── {video-id}_song_thumb.jpg
│       │   └── {video-id}_thumb.jpg
│       ├── event/
│       │   └── {video-id}_thumb.jpg
│       └── celebration/
│           └── {video-id}_thumb.jpg
│
└── audio/
    └── {movie-slug}/
        ├── album_art.jpg               # Album artwork (optional)
        └── cover_thumb.jpg             # Album art thumbnail
```

## 📐 Image Size Specifications

### Movie Posters
- **Main Poster**: 1000x1500px (2:3 aspect ratio)
- **Thumbnail**: 300x450px
- **Format**: JPG (quality: 85%)

### Movie Banners
- **Main Banner**: 1920x1080px (16:9 aspect ratio)
- **Thumbnail**: 600x340px
- **Format**: JPG (quality: 85%)

### Photos
- **Original**: Variable (optimize for web, max 3000x3000px)
- **Large Version**: 1200x1200px (max)
- **Thumbnail**: 400x400px
- **Format**: JPG (quality: 80%)

### Video Thumbnails
- **Size**: 1280x720px (16:9)
- **Format**: JPG (quality: 85%)

### Audio Album Art
- **Size**: 500x500px (1:1)
- **Thumbnail**: 200x200px
- **Format**: JPG (quality: 85%)

## 🚀 Getting Started with Cloudflare R2

### Step 1: Create R2 Bucket
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → **Create Bucket**
3. Name it: `ntr-filmography`
4. Click **Create Bucket**

### Step 2: Create API Token
1. Go to **Account Settings** → **API Tokens**
2. Click **Create Token**
3. Name: `NTR Filmography R2`
4. Select **Edit** permission for `com.cloudflare.edge.r2.bucket.content.*`
5. Select your bucket
6. Copy the credentials:
   - `Access Key ID`
   - `Secret Access Key`

### Step 3: Get Your R2 Endpoint
1. Go to R2 Bucket settings
2. Copy the **S3 API Endpoint**: `https://[account-id].r2.cloudflarestorage.com`

### Step 4: Custom Domain (Optional)
1. In R2 Bucket settings, go to **Settings** → **Custom Domains**
2. Add your custom domain (e.g., `cdn.ntr-filmography.com`)
3. Update your DNS records

## 🔧 Configuration in Django

### Update .env File
```env
USE_CLOUDFLARE_R2=True
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET=ntr-filmography
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_CUSTOM_DOMAIN=https://cdn.ntr-filmography.com
```

### Install Required Packages
```bash
cd backend
pip install -r requirements.txt
```

## 📤 Uploading Media via Django Admin

### Movies - Poster & Banner
1. Go to Django Admin → Movies
2. Edit a movie
3. Upload images to:
   - **Poster Image**: Auto-saves to `movies/posters/{movie-slug}/`
   - **Banner Image**: Auto-saves to `movies/banners/{movie-slug}/`

### Photos
1. Go to Django Admin → Photos → Photos
2. Create/Edit a photo
3. Upload images to:
   - **Image**: Auto-saves to `photos/images/{folder-type}/{folder-slug}/`
   - **Thumbnail**: Auto-saves to `photos/thumbnails/{folder-type}/{folder-slug}/`

### Videos - Thumbnails
1. Go to Django Admin → Videos
2. Edit a video
3. **Thumbnail Image**: Auto-saves to `videos/thumbnails/{movie-slug}/` (if linked to movie)

## 💾 Programmatic Upload Examples

### Upload via Django ORM (Python)
```python
from django.core.files.base import ContentFile
from apps.movies.models import Movie

# Get movie
movie = Movie.objects.get(slug='rrr')

# Upload poster image
with open('path/to/poster.jpg', 'rb') as f:
    movie.poster_image.save(f'poster.jpg', ContentFile(f.read()))

# Upload banner image
with open('path/to/banner.jpg', 'rb') as f:
    movie.banner_image.save(f'banner.jpg', ContentFile(f.read()))

movie.save()
```

### Using Management Command
Create `backend/apps/movies/management/commands/upload_media.py`:
```python
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from apps.movies.models import Movie
import os

class Command(BaseCommand):
    help = 'Upload media files to Cloudflare R2'

    def add_arguments(self, parser):
        parser.add_argument('movie_slug', type=str)
        parser.add_argument('poster_path', type=str)
        parser.add_argument('banner_path', type=str)

    def handle(self, *args, **options):
        movie = Movie.objects.get(slug=options['movie_slug'])
        
        # Upload poster
        with open(options['poster_path'], 'rb') as f:
            movie.poster_image.save(
                os.path.basename(options['poster_path']),
                ContentFile(f.read())
            )
        
        # Upload banner
        with open(options['banner_path'], 'rb') as f:
            movie.banner_image.save(
                os.path.basename(options['banner_path']),
                ContentFile(f.read())
            )
        
        movie.save()
        self.stdout.write(self.style.SUCCESS(f'Successfully uploaded media for {movie.title}'))
```

Usage:
```bash
python manage.py upload_media rrr path/to/poster.jpg path/to/banner.jpg
```

## 🛠️ Tools for Media Management

### 1. Wrangler CLI (Cloudflare)
```bash
# Install
npm install -g wrangler

# Upload file
wrangler r2 object create ntr-filmography/movies/posters/rrr/poster.jpg --file ./poster.jpg
```

### 2. AWS S3 CLI (Compatible with R2)
```bash
aws configure

# Set endpoint for R2
aws s3 --endpoint-url https://[account-id].r2.cloudflarestorage.com ls s3://ntr-filmography/

# Upload file
aws s3 cp poster.jpg s3://ntr-filmography/movies/posters/rrr/poster.jpg \
  --endpoint-url https://[account-id].r2.cloudflarestorage.com
```

### 3. Bulk Upload Script (Python)
```python
import boto3
from pathlib import Path

# Configure boto3 for R2
s3 = boto3.client(
    's3',
    endpoint_url='https://[account-id].r2.cloudflarestorage.com',
    aws_access_key_id='your-access-key-id',
    aws_secret_access_key='your-secret-access-key'
)

# Upload directory
media_dir = Path('media')
for file_path in media_dir.rglob('*'):
    if file_path.is_file():
        relative_path = file_path.relative_to(media_dir)
        s3.upload_file(
            str(file_path),
            'ntr-filmography',
            str(relative_path)
        )
        print(f'Uploaded: {relative_path}')
```

## 🔐 Security Best Practices

1. **Keep Credentials Secure**
   - Never commit `.env` to Git
   - Use different tokens for different environments
   - Rotate API tokens regularly

2. **Access Control**
   - Use bucket-specific API tokens (not account-wide)
   - Set appropriate CORS policies
   - Enable object versioning for recovery

3. **Performance**
   - Enable custom domain CDN caching
   - Optimize images before upload
   - Use appropriate file formats

## 🆘 Troubleshooting

### Upload Fails with 403 Error
- Check API credentials are correct
- Verify API token has R2 permissions
- Check bucket name matches

### Images Not Displaying
- Verify CORS is configured correctly
- Check custom domain is working: `ping cdn.ntr-filmography.com`
- Ensure files are public-read

### Slow Uploads
- Use AWS CLI or bulk upload script
- Optimize images first
- Check your internet connection

## 📚 Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Django Storages Documentation](https://django-storages.readthedocs.io/)
