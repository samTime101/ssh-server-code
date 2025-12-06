# IMPORT ROUTERS
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SubmissionCollectionViewSet, RoleViewSet, UserRoleViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'submissions', SubmissionCollectionViewSet, basename='submission-collection')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'user-roles', UserRoleViewSet, basename='user-role')
urlpatterns = [
    path('', include(router.urls)),
]