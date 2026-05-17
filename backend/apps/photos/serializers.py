"""
Serializers for Photos App
"""
from rest_framework import serializers
from apps.photos.models import PhotoFolder, Photo


class PhotoSerializer(serializers.ModelSerializer):
    """Serializer for Photo model"""
    class Meta:
        model = Photo
        fields = [
            'id', 'folder', 'image_url', 'thumbnail_url', 'caption',
            'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PhotoFolderDetailSerializer(serializers.ModelSerializer):
    """Serializer for PhotoFolder with nested photos"""
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = PhotoFolder
        fields = [
            'id', 'name', 'slug', 'folder_type', 'movie', 'description',
            'parent_folder', 'path', 'photos', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class PhotoFolderSerializer(serializers.ModelSerializer):
    """Serializer for PhotoFolder"""
    photo_count = serializers.SerializerMethodField()

    class Meta:
        model = PhotoFolder
        fields = [
            'id', 'name', 'slug', 'folder_type', 'movie', 'description',
            'parent_folder', 'path', 'photo_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def get_photo_count(self, obj):
        """Count direct photos + photos in immediate sub-folders."""
        count = obj.photos.count()
        for sub in obj.subfolders.all():
            count += sub.photos.count()
        return count
