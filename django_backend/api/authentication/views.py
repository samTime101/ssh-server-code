# Refactoring : Nov 1 
# Last update : Nov 3
# Samip Regmi

from rest_framework.decorators import permission_classes
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
from core.token.password_reset.generate import create_password_reset_token
from core.token.password_reset.verify import verify_password_reset_token
from core.token.password_reset.responses import *
from core.token.password_reset.send import send_password_reset_email
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

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


class VerifyEmailRequestView(APIView):
    permission_classes = [AllowAny]
    serializer_class = VerifyEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.context["user"]

        if user.is_email_verified:
            return Response(email_already_verified(), status=status.HTTP_200_OK)

        token = create_email_verification_token(user.id)
        send_verification_email(user, token)
        return Response(verification_email_sent(), status=status.HTTP_200_OK)

# TODO: RATE
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data['email'])
        token = create_password_reset_token(user.id)
        send_password_reset_email(user, token)
        return Response(verified_password_reset(), status=status.HTTP_200_OK)

class PasswordResetVerifyView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordVerifySerializer
    def post(self, request, token):
        serializer = ResetPasswordVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = verify_password_reset_token(token)
        if result["status"] != "success":
            return Response(invalid_password_reset_token(), status=400)
        user = User.objects.get(id=result["user_id"])
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response(reset_password_success(), status=200)

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

class VerifiedTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = VerifiedTokenObtainPairSerializer
