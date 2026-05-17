"""
Views for Videos App
"""
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from apps.videos.models import Video
from apps.videos.serializers import VideoSerializer, VideoListSerializer


class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Video model.
    Provides:
      - GET /api/videos/                          → list all videos (optional ?type=)
      - GET /api/videos/{id}/                     → single video detail
      - GET /api/videos/folders/                  → list folders grouped by type
        (optional ?type=song|cut|event|celebration)
      - GET /api/videos/by_folder/                → videos for a specific folder
        (?type=<type>&folder=<folder_name>)
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
        folder = self.request.query_params.get('folder', None)

        if video_type:
            queryset = queryset.filter(video_type=video_type)
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        if folder:
            queryset = queryset.filter(folder_name=folder)

        return queryset

    @action(detail=False, methods=['get'], url_path='folders')
    def folders(self, request):
        """
        Returns a list of folders (unique folder_name values) for the given video type.
        Query params:
          - type: song | cut | event | celebration  (required)
        Response: [{name, slug, count, thumbnail_url}, ...]
        """
        video_type = request.query_params.get('type')
        if not video_type:
            return Response({'error': 'type query param required (song|cut|event|celebration)'}, status=400)

        from django.db.models import Count
        qs = (
            Video.objects
            .filter(video_type=video_type, folder_name__isnull=False)
            .exclude(folder_name='')
            .values('folder_name')
            .annotate(count=Count('id'))
            .order_by('folder_name')
        )
        
        folders = []
        for row in qs:
            folder_name = row['folder_name']
            # Pick thumbnail from the first video in this folder
            first_video = (
                Video.objects
                .filter(video_type=video_type, folder_name=folder_name)
                .exclude(thumbnail_url='')
                .first()
            )
            thumbnail = first_video.thumbnail_url if first_video else ''
            from django.utils.text import slugify
            folders.append({
                'name': folder_name,
                'slug': slugify(folder_name),
                'count': row['count'],
                'thumbnail_url': thumbnail,
            })

        return Response(folders)

    @action(detail=False, methods=['get'], url_path='by_folder')
    def by_folder(self, request):
        """
        Returns all videos for a specific folder + type combination.
        Query params:
          - type: song | cut | event | celebration  (required)
          - folder: folder_name value  (required)
        """
        video_type = request.query_params.get('type')
        folder = request.query_params.get('folder')
        if not video_type or not folder:
            return Response({'error': 'type and folder query params are required'}, status=400)

        videos = Video.objects.filter(video_type=video_type, folder_name=folder)
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)
