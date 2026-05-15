"""
Serializers for Audio App
"""
from rest_framework import serializers
from apps.audio.models import AudioSong


class AudioSongSerializer(serializers.ModelSerializer):
    """Serializer for AudioSong model"""
    class Meta:
        model = AudioSong
        fields = [
            'id', 'movie', 'title', 'artist', 'music_director',
            'audio_url', 'duration_seconds', 'track_number', 'plays',
            'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AudioSongListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for audio listings"""
    class Meta:
        model = AudioSong
        fields = ['id', 'title', 'artist', 'track_number', 'duration_seconds', 'plays']
