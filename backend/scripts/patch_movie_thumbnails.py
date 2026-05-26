#!/usr/bin/env python
"""
Quick patch: update poster_url and banner_url for all movies with real R2 thumbnail URLs.
Does NOT touch photos, videos, or audio — only updates Movie records.

Usage:
    cd backend
    python3 scripts/patch_movie_thumbnails.py
"""
import os
import sys
import django

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, PROJECT_ROOT)
django.setup()

from apps.movies.models import Movie
from scripts.movie_data import MOVIE_POSTER_FILENAMES, MOVIE_LANDSCAPE_FILENAMES
from config.media_config import build_portrait_url, build_landscape_url

print("Patching movie poster/banner URLs...")

updated = 0
skipped = 0

for title, poster_file in MOVIE_POSTER_FILENAMES.items():
    try:
        movie = Movie.objects.get(title=title)
        landscape_file = MOVIE_LANDSCAPE_FILENAMES.get(title, poster_file)
        movie.poster_url = build_portrait_url(poster_file)
        movie.banner_url = build_landscape_url(landscape_file)
        movie.save(update_fields=['poster_url', 'banner_url'])
        print(f"  ✓ {title}")
        updated += 1
    except Movie.DoesNotExist:
        print(f"  ✗ NOT FOUND: {title}")
        skipped += 1

print(f"\nDone. Updated: {updated}, Not found: {skipped}")
