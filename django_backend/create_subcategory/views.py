# REFACTORED ON SEP 20 2025
# SAMIP REGMI

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateSubCategorySerializer, SubCategoryResponseSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import PermissionDenied
from rest_framework import status

class CreateSubCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=CreateSubCategorySerializer, responses=SubCategoryResponseSerializer)
    def post(self, request: Request) -> Response:
        if not request.user.is_superuser and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to perform this action.")

        serializer = CreateSubCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subcategory = serializer.save()
        response_serializer = SubCategoryResponseSerializer({
            "detail": "Subcategory created successfully",
            "subcategory": subcategory
        })
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)