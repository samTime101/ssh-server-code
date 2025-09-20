from rest_framework.response import Response
from rest_framework import status

def build_signin_response(user, access_token: str, refresh_token: str) -> Response:
    response_data = {
        "detail": "User signed in successfully",
        "user": {
            "userId": user.id,
            "email": user.email,
            "username": user.username,
            "phonenumber": getattr(user, 'phonenumber', None),
            "firstname": getattr(user, 'firstname', None),
            "lastname": getattr(user, 'lastname', None),
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
