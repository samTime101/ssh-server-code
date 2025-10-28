# OCT 15 2025
# SAMIP REGMI

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from sqldb_app.models import Category , SubCategory , SubSubCategory
from mongodb_app.mongo import Question, QuestionCategorization
from rest_framework.request import Request
from .serializers import GetCategoriesResponseSerializer
from drf_spectacular.utils import extend_schema

class GetCategoriesView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=GetCategoriesResponseSerializer)
    def get(self, request: Request) -> Response:
        categories = Category.objects.all()
        total_question_count = Question.objects.count()
        data = []

        for category in categories:
            cat_name = (category.categoryName)
            subcategories = SubCategory.objects.filter(categoryID=category)
            subcategory_list = []

            cat_docs = QuestionCategorization.objects(categories__in=[cat_name])
            category_question_count = sum(len(doc.questions) for doc in cat_docs)

            for subcategory in subcategories:
                sub_name = (subcategory.subCategoryName)
                subsubcategories = SubSubCategory.objects.filter(subCategoryID=subcategory)
                subsubcategory_list = []

                sub_docs = QuestionCategorization.objects(
                    categories__in=[cat_name],
                    subCategories__in=[sub_name],
                )
                sub_question_count = sum(len(doc.questions) for doc in sub_docs)

                for subsubcategory in subsubcategories:
                    subsub_name = (subsubcategory.subSubCategoryName)

                    subsub_docs = QuestionCategorization.objects(
                        categories__in=[cat_name],
                        subCategories__in=[sub_name],
                        subSubCategories__in=[subsub_name],
                    )
                    subsub_question_count = sum(len(doc.questions) for doc in subsub_docs)

                    subsubcategory_list.append({
                        "id": subsubcategory.subSubCategoryId,
                        "name": subsubcategory.subSubCategoryName,
                        "question_count": subsub_question_count,
                    })

                subcategory_list.append({
                    "id": subcategory.subCategoryId,
                    "name": subcategory.subCategoryName,
                    "question_count": sub_question_count,
                    "subSubCategories": subsubcategory_list,
                })

            data.append({
                "id": category.categoryId,
                "name": category.categoryName,
                "question_count": category_question_count,
                "subCategories": subcategory_list,
            })

        response_serializer = GetCategoriesResponseSerializer({
            "total_question_count": total_question_count,
            "categories": data,
        })

        return Response(response_serializer.data, status=status.HTTP_200_OK)
