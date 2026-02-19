from rest_framework.viewsets import ModelViewSet
# from core.permissions.permissions import IsAdminUser
from core.permissions.permissions import IsAdminUser
from .serializers import RoleSerializer
from sql.models import Role
from rest_framework.response import Response
from core.constants.roles import ROLE_USER

class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get', 'post', 'put', 'delete']
    lookup_field = 'id'

    def list(self, request, *args, **kwargs):
        db_roles = list(Role.objects.all().values("id", "name", "created_at", "updated_at"))

        virtual_user_role = {
            "id": "USER",
            "name": ROLE_USER,
            "created_at": None,
            "updated_at": None
        }
        return Response([virtual_user_role] + db_roles)