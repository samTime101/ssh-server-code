# REFACTORED ON SEP 20 2025
# SAMIP REGMI

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import UserSignupSerializer,UserSignupResponseSerializer
from drf_spectacular.utils import extend_schema
from rest_framework import status


class SignUpView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(request=UserSignupSerializer,responses=UserSignupResponseSerializer)

    def post(self, request:Request) -> Response:
        serializer = UserSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response_serializer = UserSignupResponseSerializer({
                "detail": "User registered successfully",
                "userId": str(user.id),
                "email": user.email,
                "username": user.username,
                "phonenumber": user.phonenumber,
                "firstname": user.firstname,
                "lastname": user.lastname
            })
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)