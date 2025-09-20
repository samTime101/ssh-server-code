from rest_framework.response import Response
from rest_framework import status

def build_subsubcategory_response(subsubcategory) -> Response:
    response_data = {
        "detail": "Sub SubCategory created successfully",
        "subsubcategory": {
            "id": subsubcategory.subSubCategoryId,
            "name": subsubcategory.subSubCategoryName,
            "subCategoryId": subsubcategory.subCategoryID.subCategoryId,
            "subCategoryName": subsubcategory.subCategoryID.subCategoryName,
            "categoryId": subsubcategory.subCategoryID.categoryID.categoryId,
            "categoryName": subsubcategory.subCategoryID.categoryID.categoryName,
        }
    }
    return Response(response_data, status=status.HTTP_201_CREATED)