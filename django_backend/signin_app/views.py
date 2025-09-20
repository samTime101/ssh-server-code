# REFACTORED CODE
# SEPTEMBER 20 2025
# SAMIP REGMI

# SOME INFORMATION ON REQUEST PAYLOAD:
# 1--
# SIGNIN FIELD ACCEPTS ONLY EMAIL AND PASSWORD IF PAYLOAD CONSISTS OF OTHER FIELDS
# IT WILL JUST IGNORE THEM THIS IS DJANGO DEFAULT BEHAVIOR
# {
#     "email":"ok@ok.com",
#     "username":"hello",
#     "phonenumber":"100",
#     "firstname":"wow",
#     "lastname":"nice",
#     "password":"ohnohiii"
# }

# 2--
# IF PAYLOAD CONSISTS OF DUPLICATE FIELDS LIKE THIS
# {
#     "email":"ok@ok.com",
#     "email":"duplicate@ok.com",
#     "password":"ohnohiii"
# }
# DJANGO WILL TAKE THE LAST OCCURENCE OF THE FIELD
# IN THIS CASE IT WILL TAKE "duplicate@ok.com" AS THE EMAIL
# DJANGO DEFAULT BEHAVIOR


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UserSignInSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from utils.responses.signin_response import build_signin_response

class SignInView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(request = UserSignInSerializer)   

    def post(self, request: Request) -> Response:
        
        serializer: UserSignInSerializer = UserSignInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email: str = serializer.validated_data['email']
        password: str = serializer.validated_data['password']

        user = authenticate(username=email,password=password)
        if not user:
            raise AuthenticationFailed("Invalid email or password")
        if not user.is_active:
            raise AuthenticationFailed("User account is disabled")

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)    
        refresh_token = str(refresh)

        return build_signin_response(user, access_token, refresh_token)
