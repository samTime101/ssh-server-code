from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateCategorySerializer
from sqldb_app.models import Category
from drf_spectacular.utils import extend_schema

class CreateCategoryView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(request=CreateCategorySerializer)

    def post(self, request):
        # ONLY ADMIN AND STAFF CAN CREATE CATEGORY
        if not request.user.is_superuser and not request.user.is_staff:
            response_data = {
                "message": "You do not have permission to create a category",
            }
            return Response(response_data, status=status.HTTP_403_FORBIDDEN)

        serializer = CreateCategorySerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        response_data = {
            "message": "Category created successfully",
            "category":{
                "id": category.categoryId,
                "name": category.categoryName,
            }
        } 
        return Response(response_data, status=status.HTTP_201_CREATED)

    # FOR TESTING
    def get(self, request):
        categories = Category.objects.all()
        serializer = CreateCategorySerializer(categories, many=True)
        response_data = {
            "message": "Category list retrieved",
            "categories": serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)
