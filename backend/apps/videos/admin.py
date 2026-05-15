"""
Admin configuration for Videos App
"""
from django.contrib import admin
from apps.videos.models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'video_type', 'movie', 'duration_seconds', 'views', 'created_at')
    list_filter = ('video_type', 'video_category', 'movie', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at', 'views')

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'movie', 'video_type', 'description')
        }),
        ('Media', {
            'fields': ('video_url', 'thumbnail_url', 'thumbnail_image')
        }),
        ('Details', {
            'fields': ('duration_seconds', 'views')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
