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
    sort_order = models.IntegerField(default=0)

    objects = models.Manager()

    class Meta:
        ordering = ['sort_order']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['sort_order']),
        ]

    def __str__(self) -> str:
        return str(self.title)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = str(slugify(self.title))  # type: ignore
        super().save(*args, **kwargs)
