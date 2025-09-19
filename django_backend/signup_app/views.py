# MODIFIED ON AUGUST 25
# SAMIP REGMI , FIXING ERROR #3 , NOT SENDING AUTH TOKENS DURING SIGNUP

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UserSignupSerializer
from drf_spectacular.utils import extend_schema
# from sqldb_app.models import User
# from rest_framework_simplejwt.tokens import RefreshToken

class SignUpView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(request=UserSignupSerializer)

    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # DIRECTLY SEND SERIALIZER DATA 
        # return Response(serializer.data, status=status.HTTP_201_CREATED)

        # JWT
        # refresh = RefreshToken.for_user(user)
        # access_token = str(refresh.access_token)
        # refresh_token = str(refresh)

        #RETURNING CUSTOM RESPONSE
        response_data = {
            "message": "User created successfully",
            "user":{
                "userId": user.id,
                "email": user.email,
                "username": user.username,
                "phonenumber": user.phonenumber,
                "firstname": user.firstname,
                "lastname": user.lastname,
            }
            # ,
            # "tokens": {
            #     "access": access_token,
            #     "refresh": refresh_token
            # }   
        } 
        return Response(response_data, status=status.HTTP_201_CREATED)
