from rest_framework_mongoengine import viewsets
from mongo.models import Category, SubCategory
from .serializers import CategorySerializer, SubCategorySerializer, FilterSerializer, SubCategoryFilterSerializer
# from rest_framework.permissions import IsAdminUser
from core.permissions.permissions import IsAdminUser
from core.filters.status import filter_status
from core.filters.category import filter_status_category
from drf_spectacular.utils import extend_schema_view, extend_schema

@extend_schema_view(list=extend_schema(parameters=[FilterSerializer]))
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    http_method_names = ['post', 'get', 'put', 'delete']
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    lookup_value_regex = '[0-9a-f]{24}'

    def get_queryset(self):
        qs = Category.objects.all()
        return filter_status(qs, self.request)

@extend_schema_view(list=extend_schema(parameters=[SubCategoryFilterSerializer]))
class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    lookup_value_regex = '[0-9a-f]{24}'

    def get_queryset(self):
        qs = SubCategory.objects()
        qs = filter_status(qs, self.request)
        qs = filter_status_category(qs, self.request)
        return qs