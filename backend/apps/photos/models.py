"""
Photos App - Models for photo galleries
"""
from django.db import models
from apps.core.models import TimestampedModel
from apps.movies.models import Movie


class PhotoFolder(TimestampedModel):
    """Photo Folder Model - contains photos by category"""
    FOLDER_TYPE_CHOICES = [
        ('movie', 'Movie Photos'),
        ('event', 'Event Photos'),
        ('offline', 'Offline Photos'),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    folder_type = models.CharField(max_length=20, choices=FOLDER_TYPE_CHOICES)
    path = models.CharField(max_length=500, blank=True, help_text='Full relative path from Photos root (e.g. Event/ADDS/Appy fizz)')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='photo_folders', null=True, blank=True)
    description = models.TextField(blank=True)
    parent_folder = models.ForeignKey('self', on_delete=models.CASCADE, related_name='subfolders', null=True, blank=True)

    class Meta:
        ordering = ['name']
        unique_together = ('path', 'folder_type')
        indexes = [
            models.Index(fields=['folder_type']),
            models.Index(fields=['movie']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Photo(TimestampedModel):
    """Photo Model"""
    folder = models.ForeignKey(PhotoFolder, on_delete=models.CASCADE, related_name='photos')
    image_url = models.URLField(null=True, blank=True)
    image = models.ImageField(upload_to='photos/')
    thumbnail_url = models.URLField(null=True, blank=True)
    thumbnail = models.ImageField(upload_to='photos/thumbnails/', null=True, blank=True)
    caption = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['folder']),
            models.Index(fields=['order']),
        ]

    def __str__(self):
        return f"Photo - {self.folder.name}"
