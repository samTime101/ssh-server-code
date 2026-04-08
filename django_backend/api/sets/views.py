from rest_framework_mongoengine import viewsets
from mongo.models import QuestionSet
from .serializers import QuestionSetSerializer
from core.permissions.permissions import IsAdminUser, IsAuthenticated
from core.pagination import StandardResultsSetPagination
from rest_framework.response import Response
from rest_framework import status

class QuestionSetViewSet(viewsets.ModelViewSet):
    queryset = QuestionSet.objects.all()
    http_method_names = ['get', 'post', 'put', 'delete']
    permission_classes = [IsAdminUser]
    pagination_class = StandardResultsSetPagination
    lookup_field = "id"
    lookup_value_regex = '[0-9a-f]{24}'
    serializer_class = QuestionSetSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAdminUser()]