from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UserSignInSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema

class SignInView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=UserSignInSerializer)   

    def post(self, request):
        serializer = UserSignInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # JWT 
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)    
        refresh_token = str(refresh)

        response_data = {
            "message": "User signed in successfully",
            "user": {
                "userId": user.id,
                "email": user.email,
                "username": user.username,
                "phonenumber": user.phonenumber,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser
            },
            "tokens": {
                "access": access_token,
                "refresh": refresh_token
            }
        }
        return Response(response_data, status=status.HTTP_200_OK)
