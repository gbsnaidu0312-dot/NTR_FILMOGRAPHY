"""
Serializers for Videos App
"""
from rest_framework import serializers
from apps.videos.models import Video


class VideoSerializer(serializers.ModelSerializer):
    """Serializer for Video model"""
    class Meta:
        model = Video
        fields = [
            'id', 'movie', 'title', 'video_type', 'video_category', 'folder_name', 'video_url', 'thumbnail_url',
            'duration_seconds', 'views', 'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VideoListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for video listings"""
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_type', 'video_url', 'thumbnail_url', 'duration_seconds', 'views']
