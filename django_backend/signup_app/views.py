# REFACTORED ON SEP 20 2025
# SAMIP REGMI

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import UserSignupSerializer
from drf_spectacular.utils import extend_schema
from utils.responses.signup_response import build_signup_response


class SignUpView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(request=UserSignupSerializer)

    def post(self, request:Request) -> Response:
        serializer = UserSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return build_signup_response(user)
