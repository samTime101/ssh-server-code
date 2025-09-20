from rest_framework.response import Response
from rest_framework import status

def build_userhistory_response(data, attempts) -> Response:
    response_data={
        "userId": data.userId,
        "started_at": data.started_at,
        "attempts": attempts
    }
    return Response(response_data, status=status.HTTP_200_OK)