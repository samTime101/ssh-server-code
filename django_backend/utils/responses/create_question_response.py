from rest_framework.response import Response
from rest_framework import status

def build_create_response(question) -> Response:
    response_data = {
        "detail": "Question created successfully",
        "questionId": str(question.id)
    } 
    return Response(response_data, status=status.HTTP_201_CREATED)
