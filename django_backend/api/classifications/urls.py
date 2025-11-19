from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, SubCategoryViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'subcategories', SubCategoryViewSet, basename='subcategory')

urlpatterns = [
    path('', include(router.urls)),
]
