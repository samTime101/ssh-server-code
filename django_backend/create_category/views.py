from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateCategorySerializer
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import PermissionDenied
from utils.responses.create_category_response import build_category_response


class CreateCategoryView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(request=CreateCategorySerializer)

    def post(self, request: Request) -> Response:

        if not request.user.is_superuser and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to perform this action.")

        serializer = CreateCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return build_category_response(category)

