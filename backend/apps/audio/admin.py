"""
Admin configuration for Audio App
"""
from django.contrib import admin
from apps.audio.models import AudioSong


@admin.register(AudioSong)
class AudioSongAdmin(admin.ModelAdmin):
    list_display = ('track_number', 'title', 'artist', 'movie', 'duration_seconds', 'plays')
    list_filter = ('movie', 'created_at')
    search_fields = ('title', 'artist', 'music_director')
    readonly_fields = ('created_at', 'updated_at', 'plays')

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'track_number', 'movie', 'artist', 'music_director')
        }),
        ('Media', {
            'fields': ('audio_url',)
        }),
        ('Details', {
            'fields': ('duration_seconds', 'plays', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
