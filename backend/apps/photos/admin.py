"""
Admin configuration for Photos App
"""
from django.contrib import admin
from apps.photos.models import PhotoFolder, Photo


@admin.register(PhotoFolder)
class PhotoFolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'folder_type', 'movie', 'parent_folder', 'created_at')
    list_filter = ('folder_type', 'movie', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('slug', 'created_at', 'updated_at')

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'folder_type', 'movie')
        }),
        ('Hierarchy', {
            'fields': ('parent_folder',)
        }),
        ('Details', {
            'fields': ('description',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('caption', 'folder', 'order', 'created_at')
    list_filter = ('folder', 'order', 'created_at')
    search_fields = ('caption', 'folder__name')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Basic Information', {
            'fields': ('folder', 'caption', 'order')
        }),
        ('Media', {
            'fields': ('image_url', 'image', 'thumbnail_url', 'thumbnail')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
