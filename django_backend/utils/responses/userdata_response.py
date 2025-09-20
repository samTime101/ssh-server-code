from rest_framework.response import Response
from rest_framework import status

def build_userdata_response(user) -> Response:
    response_data = {
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
    return Response(response_data, status=status.HTTP_200_OK)
