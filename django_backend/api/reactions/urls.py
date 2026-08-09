from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ReactionViewSet

router = DefaultRouter()
router.register(r'reactions', ReactionViewSet, basename='reaction')
urlpatterns = [
    path('', include(router.urls)),
]