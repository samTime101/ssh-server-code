from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

class UserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  
        user_data = {
            "userId": user.id,
            "email": user.email,
            "username": user.username,
            "phonenumber": user.phonenumber,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser
        }
        return Response(user_data, status=status.HTTP_200_OK)
