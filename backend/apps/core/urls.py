"""
Core App - API Router
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.movies.views import MovieViewSet
from apps.videos.views import VideoViewSet
from apps.audio.views import AudioSongViewSet
from apps.photos.views import PhotoFolderViewSet, PhotoViewSet

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'audio-songs', AudioSongViewSet, basename='audio-song')
router.register(r'photos/folders', PhotoFolderViewSet, basename='photo-folder')
router.register(r'photos', PhotoViewSet, basename='photo')

app_name = 'core'

urlpatterns = [
    path('', include(router.urls)),
]
