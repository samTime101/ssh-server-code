# Refactoring : Nov 1 
# Last update : Nov 3
# Samip Regmi

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework.permissions import AllowAny
from core.permissions.permissions import AllowAny
from .serializers import SignUpSerializer, SignupResponseSerializer

# for signup
class SignupView(APIView):
    permission_classes = [AllowAny]
    serializer_class = SignUpSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response_data = SignupResponseSerializer(user)
        return Response(response_data.data, status=status.HTTP_201_CREATED)