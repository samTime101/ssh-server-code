from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from sqldb_app.models import Category , SubCategory , SubSubCategory
from mongodb_app.mongo import Question
from rest_framework.request import Request
from .serializers import GetCategoriesResponseSerializer
from drf_spectacular.utils import extend_schema

class GetCategoriesView(APIView):

    permission_classes = [IsAuthenticated]
    @extend_schema(
        responses=GetCategoriesResponseSerializer
    )

    def get(self, request: Request) -> Response:
        categories = Category.objects.all()
        data = []
        total_question_count = Question.objects.count()
        for category in categories:
            #SELECT FROM SUBCATEGORIES WHERE categoryID = category 
            subcategories = SubCategory.objects.filter(categoryID=category)
            subcategory_list = []
            for subcategory in subcategories:
                # SAME HERE ALSO AND BELOW
                subsubcategories = SubSubCategory.objects.filter(subCategoryID=subcategory)
                subsubcategory_list = []

                for subsubcategory in subsubcategories:
                    subsubcategory_list.append({
                        "id": subsubcategory.subSubCategoryId,
                        # SAME HERE , USING THREE CONDITIONS TO COUNT
                        "question_count": Question.objects(category=category.categoryName, subCategory=subcategory.subCategoryName, subSubCategory=subsubcategory.subSubCategoryName).count(),
                        "name": subsubcategory.subSubCategoryName,
                    })
                subcategory_list.append({
                    "id": subcategory.subCategoryId,
                    "name": subcategory.subCategoryName,
                    # SAME HERE BUT ONLY TWO CONDITIONS
                    "question_count": Question.objects(category=category.categoryName, subCategory=subcategory.subCategoryName).count(),
                    "subSubCategories": subsubcategory_list,
                })
            data.append({
                "id": category.categoryId,
                "name": category.categoryName,
                # SELECT COUNT(*) FROM QUESTIONS WHERE category=category.categoryName
                "question_count": Question.objects(category=category.categoryName).count(),
                "subCategories": subcategory_list,
            })
        response_serializer = GetCategoriesResponseSerializer({
        "total_question_count": total_question_count,
        "categories": data
        })
        return Response(response_serializer.data, status=status.HTTP_200_OK)
            


