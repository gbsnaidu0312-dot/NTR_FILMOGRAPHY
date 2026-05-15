"""
Views for Videos App
"""
from rest_framework import viewsets, filters
from apps.videos.models import Video
from apps.videos.serializers import VideoSerializer, VideoListSerializer


class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Video model
    """
    queryset = Video.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'views']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return VideoListSerializer
        return VideoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        video_type = self.request.query_params.get('type', None)
        movie_id = self.request.query_params.get('movie', None)
        
        if video_type:
            queryset = queryset.filter(video_type=video_type)
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        
        return queryset
