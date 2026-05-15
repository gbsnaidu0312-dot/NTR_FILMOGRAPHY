"""
Admin configuration for Movies App
"""
from django.contrib import admin
from apps.movies.models import Movie


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_year', 'slug', 'created_at')
    list_filter = ('release_year', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('slug', 'created_at', 'updated_at')

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'release_year', 'genre', 'director')
        }),
        ('Media', {
            'fields': ('poster_url', 'banner_url', 'movie_url', 'poster_image', 'banner_image')
        }),
        ('Details', {
            'fields': ('description', 'duration_minutes', 'box_office')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
