from django.urls import path

from .views import QuestionBankStatsAPIView, AdminDashboardStatsAPIView

urlpatterns = [
    path('analytics/questionbank/', QuestionBankStatsAPIView.as_view(), name='questionbank-stats'),
    path('analytics/dashboard/', AdminDashboardStatsAPIView.as_view(), name='admin-dashboard-stats'),
]
