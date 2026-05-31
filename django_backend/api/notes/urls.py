from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuestionNoteDetailViewSet
router = DefaultRouter()

router.register(r'notes/(?P<question_id>[^/.]+)', QuestionNoteDetailViewSet, basename='question-notes')

urlpatterns = [
    path('', include(router.urls)),
]