from rest_framework.viewsets import ModelViewSet
# from core.permissions.permissions import IsAdminUser
from core.permissions.permissions import IsAdminUser
from .serializers import RoleSerializer
from sql.models import Role

class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get', 'post', 'put', 'delete', ]
    lookup_field = 'id'