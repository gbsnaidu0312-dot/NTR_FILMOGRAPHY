"""
Serializers for Movies App
"""
from rest_framework import serializers
from apps.movies.models import Movie


class MovieSerializer(serializers.ModelSerializer):
    """Serializer for Movie model"""
    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'slug', 'release_year', 'description',
            'poster_url', 'banner_url', 'movie_url', 'duration_minutes', 'genre', 'director',
            'box_office', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class MovieListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for movie listings"""
    class Meta:
        model = Movie
        fields = ['id', 'title', 'slug', 'release_year', 'poster_url', 'banner_url', 'movie_url', 'genre']
