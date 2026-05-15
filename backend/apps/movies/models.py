"""
Movies App - Models for movie data
"""
from django.db import models
from django.utils.text import slugify
from apps.core.models import TimestampedModel


class Movie(TimestampedModel):
    """Movie Model"""
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    release_year = models.IntegerField()
    description = models.TextField()
    poster_url = models.URLField(null=True, blank=True)
    banner_url = models.URLField(null=True, blank=True)
    poster_image = models.ImageField(upload_to='movies/posters/', null=True, blank=True)
    banner_image = models.ImageField(upload_to='movies/banners/', null=True, blank=True)
    movie_url = models.URLField(null=True, blank=True, help_text='Full movie file URL for playback')
    duration_minutes = models.IntegerField(null=True, blank=True)
    genre = models.CharField(max_length=100, null=True, blank=True)
    director = models.CharField(max_length=100, null=True, blank=True)
    box_office = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        ordering = ['-release_year', 'title']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['-release_year']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
