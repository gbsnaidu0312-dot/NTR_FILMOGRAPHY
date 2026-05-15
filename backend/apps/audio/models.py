"""
Audio App - Models for audio songs
"""
from django.db import models
from apps.core.models import TimestampedModel
from apps.movies.models import Movie


class AudioSong(TimestampedModel):
    """Audio Song Model"""
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='audio_songs', null=True, blank=True)
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255, null=True, blank=True)
    music_director = models.CharField(max_length=255, null=True, blank=True)
    audio_url = models.URLField()
    duration_seconds = models.IntegerField(null=True, blank=True)
    track_number = models.IntegerField(default=1)
    plays = models.IntegerField(default=0)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['track_number']
        unique_together = ('movie', 'track_number')
        indexes = [
            models.Index(fields=['movie']),
            models.Index(fields=['track_number']),
        ]

    def __str__(self):
        return f"{self.track_number}. {self.title}"
