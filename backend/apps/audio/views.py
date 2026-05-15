"""
Views for Audio App
"""
from rest_framework import viewsets, filters
from apps.audio.models import AudioSong
from apps.audio.serializers import AudioSongSerializer, AudioSongListSerializer


class AudioSongViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for AudioSong model
    """
    queryset = AudioSong.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'artist', 'music_director']
    ordering_fields = ['track_number', 'plays']
    ordering = ['track_number']

    def get_serializer_class(self):
        if self.action == 'list':
            return AudioSongListSerializer
        return AudioSongSerializer
