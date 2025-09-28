from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateCategorySerializer, CategoryResponseSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import PermissionDenied


class CreateCategoryView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(request=CreateCategorySerializer,responses=CategoryResponseSerializer)

    def post(self, request: Request) -> Response:

        if not request.user.is_superuser and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to perform this action.")

        serializer = CreateCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        response_serializer = CategoryResponseSerializer({
            "detail": "Category created successfully",
            "category": category
        })
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

