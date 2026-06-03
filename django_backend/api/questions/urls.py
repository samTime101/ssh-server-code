from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuestionViewSet, QuestionFeedbackViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'questions/(?P<question_id>[^/.]+)/feedback', QuestionFeedbackViewSet, basename='question-feedback')

urlpatterns = [
    path('', include(router.urls)),
]
