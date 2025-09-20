from rest_framework.response import Response
from rest_framework import status

def build_subcategory_response(subcategory) -> Response:
    response_data = {
        "detail": "SubCategory created successfully",
        "subcategory":{
            "id": subcategory.subCategoryId,
            "name": subcategory.subCategoryName,
            "categoryId": subcategory.categoryID.categoryId,
            "categoryName": subcategory.categoryID.categoryName
        }
    } 
    return Response(response_data, status=status.HTTP_201_CREATED)