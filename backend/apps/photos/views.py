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
    ViewSet for PhotoFolder model.

    When ?type=movie or ?type=event is requested, the DB stores a single root
    "Movie" / "Event" wrapper folder (parent_folder=None) with all movie/event
    folders as its children.  The root wrapper itself has 0 direct photos, so
    we skip it and return the children directly so the frontend sees Aadi,
    Ashok, ADDS, AWARDS … with real photo counts.

    For ?type=offline the photos sit directly in the root Offline folder, so
    we keep the old root-only behaviour.
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
        # Allow retrieving any folder by slug, otherwise subfolders return 404
        if self.action in ['retrieve', 'subfolders']:
            return PhotoFolder.objects.all()

        folder_type = self.request.query_params.get('type', None)

        if folder_type in ('movie', 'event'):
            # Skip the wrapper root folder; return its children directly.
            # The root wrapper is: parent_folder=None, folder_type=folder_type, name='Movie'/'Event'
            root_folders = PhotoFolder.objects.filter(
                parent_folder__isnull=True,
                folder_type=folder_type,
            )
            if root_folders.exists():
                # Return all direct children of those root folders
                return PhotoFolder.objects.filter(
                    parent_folder__in=root_folders,
                    folder_type=folder_type,
                ).order_by('name')
            # Fallback: no wrapper exists, return root-level folders as before
            return PhotoFolder.objects.filter(
                parent_folder__isnull=True,
                folder_type=folder_type,
            ).order_by('name')

        # offline (or no type filter): keep original root-only queryset
        queryset = PhotoFolder.objects.filter(parent_folder__isnull=True)
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
