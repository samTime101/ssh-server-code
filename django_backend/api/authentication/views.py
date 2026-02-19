# Refactoring : Nov 1 
# Last update : Nov 3
# Samip Regmi

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework.permissions import AllowAny
from core.permissions.permissions import AllowAny
from .serializers import *
from core.token.email_verification.generate import create_email_verification_token
from core.token.email_verification.verify import verify_email_token
from core.token.email_verification.responses import *
from core.token.email_verification.send import send_verification_email

# for signup
class SignupView(APIView):
    permission_classes = [AllowAny]
    serializer_class = SignUpSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = create_email_verification_token(user.id)
        send_verification_email(user, token)
        response_data = SignupResponseSerializer(user)
        return Response(response_data.data, status=status.HTTP_201_CREATED)

# TODO: rate limiting
class EmailVerifyView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailVerifySerializer
    def get(self, request, token):
        verification_result = verify_email_token(token)
        print(f"Verification result: {verification_result}")
        if verification_result == "EMAIL_VERIFICATION_SUCCESS":
            return Response(verified_email(), status=status.HTTP_200_OK)
        elif verification_result == "EMAIL_ALREADY_VERIFIED":
            return Response(email_already_verified(), status=status.HTTP_200_OK)
        else:
            return Response(invalid_verification_token(), status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    serializer_class = ResetPasswordSerializer
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        new_password = serializer.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
    
class ResetPhoneNumberView(APIView):
    serializer_class = ResetPhoneNumberSerializer
    def post(self, request):
        serializer = ResetPhoneNumberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        new_phonenumber = serializer.validated_data['new_phonenumber']
        user.phonenumber = new_phonenumber
        user.save()
        return Response({"detail": "Phone number has been updated successfully."}, status=status.HTTP_200_OK)