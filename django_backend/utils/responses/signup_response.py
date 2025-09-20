from rest_framework.response import Response
from rest_framework import status

def build_signup_response(user) -> Response:
    response_data = {
        "detail": "User created successfully",
        "user":{
            "userId": user.id,
            "email": user.email,
            "username": user.username,
            "phonenumber": user.phonenumber,
            "firstname": user.firstname,
            "lastname": user.lastname,
        }
    } 
    return Response(response_data, status=status.HTTP_201_CREATED)
