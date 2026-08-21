from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ClientAdminSetupView

router = DefaultRouter()
router.register(r"clients", ClientViewSet, basename="client")

urlpatterns = [
    path("clients/setup-admin/", ClientAdminSetupView.as_view(), name="client-setup-admin"),
    path("", include(router.urls)),
]
