"""
Videos App - Models for video data
"""
from django.db import models
from apps.core.models import TimestampedModel
from apps.movies.models import Movie


class Video(TimestampedModel):
    """Video Model for movie cuts, songs, and event videos"""
    VIDEO_TYPE_CHOICES = [
        ('cut', 'Video Cut'),
        ('song', 'Video Song'),
        ('event', 'Event Video'),
        ('celebration', 'Celebration Video'),
        ('ads', 'Advertisement'),
    ]

    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='videos', null=True, blank=True)
    title = models.CharField(max_length=255)
    video_type = models.CharField(max_length=20, choices=VIDEO_TYPE_CHOICES)
    video_category = models.CharField(max_length=50, null=True, blank=True, help_text='Top-level category from Videos/ (e.g. Celebrations, Events, Adds, etc.)')
    folder_name = models.CharField(max_length=255, null=True, blank=True, help_text='Category/folder name for events and celebrations')
    video_url = models.URLField()
    thumbnail_url = models.URLField(null=True, blank=True)
    thumbnail_image = models.ImageField(upload_to='videos/thumbnails/', null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)
    views = models.IntegerField(default=0)
    description = models.TextField(blank=True)

    objects = models.Manager()

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['video_type']),
            models.Index(fields=['movie']),
        ]

    def __str__(self):
        return f"{self.title} ({self.video_type})"
