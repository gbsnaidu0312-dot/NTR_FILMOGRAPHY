"""
Debug: Check router URL generation
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from rest_framework.routers import DefaultRouter
from apps.movies.views import MovieViewSet

# Create router and register
router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')

print("=== Router URLs ===")
for url in router.urls:
    print(f"  {url.pattern} -> {url.name}")

print(f"\n=== Total URLs: {len(router.urls)} ===")
