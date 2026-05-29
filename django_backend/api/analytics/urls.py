from django.urls import path

from .views import QuestionBankStatsAPIView

urlpatterns = [
    path('analytics/questionbank/', QuestionBankStatsAPIView.as_view(), name='questionbank-stats'),
]
