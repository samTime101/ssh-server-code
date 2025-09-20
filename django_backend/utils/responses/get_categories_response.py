from rest_framework.response import Response
from rest_framework import status

def build_getcategories_response(total_question_count, categories) -> Response:
    response_data={
        "total_question_count": total_question_count,
        "categories": categories,
    }
    return Response(response_data, status=status.HTTP_200_OK)