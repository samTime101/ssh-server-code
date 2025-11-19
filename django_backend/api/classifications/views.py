from rest_framework_mongoengine import viewsets
from mongo.models import Category, SubCategory
from .serializers import CategorySerializer, SubCategorySerializer
from rest_framework.permissions import IsAdminUser

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    http_method_names = ['post', 'get', 'put', 'delete']
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    lookup_value_regex = '[0-9a-f]{24}'

class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    lookup_value_regex = '[0-9a-f]{24}'