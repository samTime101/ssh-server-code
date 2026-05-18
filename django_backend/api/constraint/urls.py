from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ConstraintViewSet

router = DefaultRouter()
router.register(r"constraints", ConstraintViewSet, basename="constraint")

urlpatterns = [path("", include(router.urls)),]
