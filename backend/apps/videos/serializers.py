"""
Serializers for Videos App
"""
from rest_framework import serializers
from apps.videos.models import Video


class VideoSerializer(serializers.ModelSerializer):
    """Serializer for Video model"""
    movie_poster = serializers.ReadOnlyField(source='movie.poster_url')
    movie_banner = serializers.ReadOnlyField(source='movie.banner_url')

    class Meta:
        model = Video
        fields = [
            'id', 'movie', 'title', 'video_type', 'video_category', 'folder_name', 'video_url', 'thumbnail_url',
            'duration_seconds', 'views', 'description', 'movie_poster', 'movie_banner', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VideoListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for video listings"""
    movie_poster = serializers.ReadOnlyField(source='movie.poster_url')
    movie_banner = serializers.ReadOnlyField(source='movie.banner_url')

    class Meta:
        model = Video
        fields = [
            'id', 'title', 'video_type', 'video_url', 'thumbnail_url', 'duration_seconds', 'views',
            'movie_poster', 'movie_banner'
        ]

