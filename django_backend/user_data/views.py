from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from .serializers import UserDataResponseSerializer
from drf_spectacular.utils import extend_schema 

class UserDataView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(responses=UserDataResponseSerializer)
    def get(self, request: Request) -> Response:
        user = request.user
        serializer = UserDataResponseSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)