from rest_framework_mongoengine.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAdminUser
from mongo.models import College
from core.pagination import StandardResultsSetPagination
from .serializers import CollegeSerializer

class CollegeViewSet(ModelViewSet):
    queryset = College.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = CollegeSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'delete', 'put', 'patch']
    lookup_field = 'id'
    lookup_value_regex = '[0-9a-f]{24}'


    def get_permissions(self):
        if self.action in ['list']:
            self.permission_classes = [AllowAny]
        return super().get_permissions()