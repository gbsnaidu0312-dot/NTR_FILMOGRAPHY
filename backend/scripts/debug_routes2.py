"""
Debug: Check if MovieViewSet action endpoints are properly registered
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.urls import get_resolver
from rest_framework.routers import DefaultRouter
from apps.movies.views import MovieViewSet

# Check if the viewset has actions registered
print("=== MovieViewSet actions ===")
for method_name in dir(MovieViewSet):
    method = getattr(MovieViewSet, method_name)
    if hasattr(method, 'actions') or hasattr(method, 'mapping'):
        print(f"  {method_name}: actions={getattr(method, 'actions', None)}")
    if hasattr(method, '_action_type'):
        print(f"  {method_name}: _action_type={method._action_type}")

# Also check using bind_to_router
print("\n=== Checking action decorators ===")
import inspect
for name, method in inspect.getmembers(MovieViewSet, predicate=inspect.isfunction):
    if hasattr(method, 'detail'):
        print(f"  {name}: detail={method.detail}, methods={getattr(method, 'mapping', {})}")

# Check URL patterns
print("\n=== Movie-related URL patterns ===")
resolver = get_resolver()
for pattern in resolver.url_patterns:
    pattern_str = str(pattern.pattern)
    if 'movie' in pattern_str.lower():
        print(f"  {pattern_str} -> {pattern.name or pattern.callback}")
