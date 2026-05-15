"""
Views for Photos App
"""
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.photos.models import PhotoFolder, Photo
from apps.photos.serializers import PhotoFolderSerializer, PhotoFolderDetailSerializer, PhotoSerializer


class PhotoFolderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for PhotoFolder model
    """
    queryset = PhotoFolder.objects.filter(parent_folder__isnull=True)
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PhotoFolderDetailSerializer
        return PhotoFolderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        folder_type = self.request.query_params.get('type', None)
        if folder_type:
            queryset = queryset.filter(folder_type=folder_type)
        return queryset

    @action(detail=True, methods=['get'])
    def subfolders(self, request, slug=None):
        """Get subfolders for a specific folder"""
        folder = self.get_object()
        subfolders = folder.subfolders.all()
        serializer = PhotoFolderSerializer(subfolders, many=True)
        return Response(serializer.data)


class PhotoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Photo model
    """
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['caption']
    ordering_fields = ['order', 'created_at']
    ordering = ['order', '-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        folder_id = self.request.query_params.get('folder', None)
        if folder_id:
            queryset = queryset.filter(folder_id=folder_id)
        return queryset
