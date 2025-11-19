# IMPORT ROUTERS
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SubmissionCollectionViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'submissions', SubmissionCollectionViewSet, basename='submission-collection')
urlpatterns = [
    path('', include(router.urls)),
]