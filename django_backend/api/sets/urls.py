from .views import QuestionSetViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'sets', QuestionSetViewSet, basename='sets')

urlpatterns = [
    path('', include(router.urls)),
]