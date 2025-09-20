# REFACTORED ON SEP 20 2025
# SAMIP REGMI

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateSubCategorySerializer
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import PermissionDenied
from utils.responses.create_sub_category_response import build_subcategory_response

class CreateSubCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=CreateSubCategorySerializer)
    def post(self, request: Request) -> Response:
        if not request.user.is_superuser and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to perform this action.")

        serializer = CreateSubCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subcategory = serializer.save()
        return build_subcategory_response(subcategory)

