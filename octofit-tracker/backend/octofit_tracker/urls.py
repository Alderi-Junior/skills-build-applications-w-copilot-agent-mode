"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, TeamViewSet, ActivityViewSet, WorkoutViewSet, LeaderboardViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'workouts', WorkoutViewSet)
router.register(r'leaderboard', LeaderboardViewSet)

CODESPACE_NAME = os.getenv('CODESPACE_NAME', '')
BASE_URL = f'https://{CODESPACE_NAME}-8000.app.github.dev/api' if CODESPACE_NAME else 'http://localhost:8000/api'

def api_root(request, format=None):
    return JsonResponse({
        'users': f'{BASE_URL}/users/',
        'teams': f'{BASE_URL}/teams/',
        'activities': f'{BASE_URL}/activities/',
        'workouts': f'{BASE_URL}/workouts/',
        'leaderboard': f'{BASE_URL}/leaderboard/',
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
