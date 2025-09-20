from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from utils.responses.userdata_response import build_userdata_response

class UserDataView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request) -> Response:
        user = request.user  
        return build_userdata_response(user)
