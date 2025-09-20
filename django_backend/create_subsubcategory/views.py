# REFACTORED ON SEP 20 2025
# SAMIP REGMI

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateSubSubCategorySerializer
from rest_framework.request import Request
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import PermissionDenied
from utils.responses.create_sub_sub_category_response import build_subsubcategory_response
class CreateSubSubCategoryView(APIView):

    permission_classes = [IsAuthenticated]
    @extend_schema(request=CreateSubSubCategorySerializer)
    
    def post(self, request: Request) -> Response:

        if not request.user.is_superuser and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to perform this action.")
        
        serializer = CreateSubSubCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subsubcategory = serializer.save()  
        return build_subsubcategory_response(subsubcategory)