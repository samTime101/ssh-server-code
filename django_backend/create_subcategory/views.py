from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateSubCategorySerializer
from sqldb_app.models import Category , SubCategory
from drf_spectacular.utils import extend_schema

class CreateSubCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=CreateSubCategorySerializer)
    def post(self, request):
        # ONLY ADMIN AND STAFF CAN CREATE SUBCATEGORY
        if not request.user.is_superuser and not request.user.is_staff:
            response_data = {
                "message": "You do not have permission to create a subcategory",
            }
            return Response(response_data, status=status.HTTP_403_FORBIDDEN)

        serializer = CreateSubCategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subcategory = serializer.save()
        response_data = {
            "message": "Sub Category created successfully",
            "subcategory":{
                "id": subcategory.subCategoryId,
                "name": subcategory.subCategoryName,
                "categoryId":subcategory.categoryID.categoryId,
                "categoryName": subcategory.categoryID.categoryName
            }
        } 
        return Response(response_data, status=status.HTTP_201_CREATED)

    def get(self, request):
        subcategories = SubCategory.objects.all()
        serializer = CreateSubCategorySerializer(subcategories, many=True)
        response_data = {
            "message": "Sub Category list retrieved",
            "subcategories": serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)
