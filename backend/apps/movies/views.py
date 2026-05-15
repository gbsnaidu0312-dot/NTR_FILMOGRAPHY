"""
Views for Movies App
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.movies.models import Movie
from apps.movies.serializers import MovieSerializer, MovieListSerializer
from apps.videos.serializers import VideoSerializer
from apps.audio.serializers import AudioSongSerializer


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Movie model
    Provides list and detail views for movies
    """
    queryset = Movie.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return MovieListSerializer
        return MovieSerializer

    @action(detail=True, methods=['get'], url_path='audio-songs')
    def audio_songs(self, request, slug=None):
        """Get audio songs for a specific movie"""
        movie = self.get_object()
        songs = movie.audio_songs.all()
        serializer = AudioSongSerializer(songs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='video-cuts')
    def video_cuts(self, request, slug=None):
        """Get video cuts for a specific movie"""
        movie = self.get_object()
        videos = movie.videos.filter(video_type='cut')
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='video-songs')
    def video_songs(self, request, slug=None):
        """Get video songs for a specific movie"""
        movie = self.get_object()
        videos = movie.videos.filter(video_type='song')
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)
