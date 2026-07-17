from rest_framework_mongoengine import viewsets
from core.pagination import StandardResultsSetPagination
from core.permissions.permissions import AllowAny, IsAdminUser
from mongo.models import Testimonial
from .serializers import TestimonialSerializer

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.order_by("-created_at")
    serializer_class = TestimonialSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ["get", "post", "put", "patch", "delete"]
    lookup_field = "id"
    lookup_value_regex = "[0-9a-f]{24}"
    permission_classes = [IsAdminUser]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]