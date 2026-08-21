# STRICT ADMIN ONLY ENDPOINT
# SAMIP REGMI AUG 21
from rest_framework import viewsets
from core.pagination import StandardResultsSetPagination
from core.permissions.permissions import IsAdminUser
from sql.models import Client
from .serializers import ClientSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by("-created_at")
    serializer_class = ClientSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ["get", "post", "put", "patch", "delete"]
    lookup_field = "id"
    permission_classes = [IsAdminUser]