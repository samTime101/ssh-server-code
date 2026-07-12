from django.urls import path

from .views import QuestionBankStatsAPIView, TopicWiseAnalyticsAPIView

urlpatterns = [
    path('analytics/questionbank/', QuestionBankStatsAPIView.as_view(), name='questionbank-stats'),
    path('analytics/topicwise/', TopicWiseAnalyticsAPIView.as_view(), name='topicwise-stats'),
]
