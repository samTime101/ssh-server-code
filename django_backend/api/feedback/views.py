from rest_framework_mongoengine import viewsets
from core.pagination import StandardResultsSetPagination
from core.permissions.permissions import AllowAny, IsAdminUser
from mongo.models import Feedback
from .serializers import FeedbackAdminSerializer, FeedbackCreateSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.order_by("-created_at")
    pagination_class = StandardResultsSetPagination
    http_method_names = ["get", "post"]
    lookup_field = "id"
    lookup_value_regex = "[0-9a-f]{24}"
    permission_classes = [IsAdminUser]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == "create":
            return FeedbackCreateSerializer
        return FeedbackAdminSerializer
