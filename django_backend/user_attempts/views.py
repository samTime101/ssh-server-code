from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .serializers import UserAttemptSerializer, UserAttemptResponseSerializer
from drf_spectacular.utils import extend_schema 
from rest_framework import status

class UserAttemptView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(request=UserAttemptSerializer, responses=UserAttemptResponseSerializer)
    def post(self, request: Request) -> Response:

        serializer = UserAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create(serializer.validated_data)
        response_serializer = UserAttemptResponseSerializer({
            "detail": "Attempt recorded successfully"
        })
        return Response(response_serializer.data,status = status.HTTP_201_CREATED)

