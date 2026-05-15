"""
Cloudflare R2 Storage Configuration
"""
from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class CloudflareR2Storage(S3Boto3Storage):
    """Custom storage class for Cloudflare R2"""
    
    def __init__(self, *args, **kwargs):
        self.access_key = settings.CLOUDFLARE_R2_ACCESS_KEY_ID
        self.secret_key = settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY
        self.storage_bucket_name = settings.CLOUDFLARE_R2_BUCKET
        self.endpoint_url = settings.CLOUDFLARE_R2_ENDPOINT
        self.region_name = 'auto'
        self.custom_domain = settings.CLOUDFLARE_R2_CUSTOM_DOMAIN
        self.location = ''
        super().__init__(*args, **kwargs)


class MediaStorage(CloudflareR2Storage):
    """Storage for media files (images, videos)"""
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = False
    compress_css = False
    compress_js = False
    gzip_content_types = (
        'text/css',
        'text/javascript',
        'application/javascript',
        'application/x-javascript',
        'image/svg+xml',
    )


class MoviePosterStorage(CloudflareR2Storage):
    """Storage for movie posters"""
    location = 'movies/posters'
    default_acl = 'public-read'
    file_overwrite = True


class MovieBannerStorage(CloudflareR2Storage):
    """Storage for movie banners"""
    location = 'movies/banners'
    default_acl = 'public-read'
    file_overwrite = True


class PhotoImageStorage(CloudflareR2Storage):
    """Storage for photo images"""
    location = 'photos/images'
    default_acl = 'public-read'
    file_overwrite = False


class PhotoThumbnailStorage(CloudflareR2Storage):
    """Storage for photo thumbnails"""
    location = 'photos/thumbnails'
    default_acl = 'public-read'
    file_overwrite = False


class VideoThumbnailStorage(CloudflareR2Storage):
    """Storage for video thumbnails"""
    location = 'videos/thumbnails'
    default_acl = 'public-read'
    file_overwrite = False


class AudioStorage(CloudflareR2Storage):
    """Storage for audio files"""
    location = 'audio'
    default_acl = 'public-read'
    file_overwrite = False
