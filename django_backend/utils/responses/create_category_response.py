from rest_framework.response import Response
from rest_framework import status

def build_category_response(category) -> Response:
    response_data = {
        "detail": "Category created successfully",
        "category":{
            "id": category.categoryId,
            "name": category.categoryName,
        }
    } 
    return Response(response_data, status=status.HTTP_201_CREATED)
