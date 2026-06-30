from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from sql.models import Subscription
from .serializers import SubscriptionSerializer
from drf_spectacular.utils import extend_schema
from django_filters.rest_framework import DjangoFilterBackend
from core.permissions.permissions import *

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [AllowAny]
    http_method_names = ["get", "post", "put", "patch", "delete"]
    filter_backends = [DjangoFilterBackend]

    filterset_fields = {"status": ["exact"],}

    @extend_schema(request=SubscriptionSerializer)
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAdminUser()]

