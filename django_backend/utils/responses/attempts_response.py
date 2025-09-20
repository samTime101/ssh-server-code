from rest_framework.response import Response
from rest_framework import status

def build_userattempt_response() -> Response:
    response_data={
        "detail": "User attempt recorded successfully",
    }
    return Response(response_data, status=status.HTTP_201_CREATED)