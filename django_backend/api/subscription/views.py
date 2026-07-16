from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from sql.models import Subscription, SubscriptionOrder
from .serializers import SubscriptionSerializer, SubscriptionOrderSerializer
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination
from core.permissions.permissions import *


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny]
    http_method_names = ["get", "post", "put", "patch", "delete"]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {"status": ["exact"],}
    
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAdminUser()]

class SubscriptionOrderViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionOrder.objects.all()
    serializer_class = SubscriptionOrderSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.has_role("ADMIN"):
            return SubscriptionOrder.objects.all()
        return SubscriptionOrder.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        return [IsAdminUser()]
