# Refactoring : Nov 1 
# Last update : Nov 3
# Samip Regmi

from rest_framework.decorators import permission_classes
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
# from rest_framework.permissions import AllowAny
from core.permissions.permissions import *
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
from .services.google_auth import exchange_code_for_token, verify_google_id_token
from .services.google_login import build_google_auth_tokens, resolve_google_login

User = get_user_model()

# for signup
class SignupView(APIView):
    permission_classes = [AllowAny]
    serializer_class = SignUpSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data = request.data, context={'request': request})
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
        if verification_result == "EMAIL_VERIFICATION_SUCCESS":
            return Response(verified_email(), status=status.HTTP_200_OK)
        elif verification_result == "EMAIL_ALREADY_VERIFIED":
            return Response(email_already_verified(), status=status.HTTP_200_OK)
        else:
            return Response(invalid_verification_token(), status=status.HTTP_400_BAD_REQUEST)


class EmailVerifyRequestView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailVerifyRequestSerializer

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
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data['email'])
        token = create_password_reset_token(user.id)
        send_password_reset_email(user, token)
        return Response(verified_password_reset(), status=status.HTTP_200_OK)

class ForgotPasswordVerifyView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordVerifySerializer
    def post(self, request, token):
        serializer = ForgotPasswordVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = verify_password_reset_token(token)
        if result["status"] != "success":
            return Response(invalid_password_reset_token(), status=400)
        user = User.objects.get(id=result["user_id"])
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response(reset_password_success(), status=200)

class PhoneNumberChangeView(APIView):
    serializer_class = PhoneNumberChangeSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = PhoneNumberChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        new_phonenumber = serializer.validated_data['new_phonenumber']
        user.phonenumber = new_phonenumber
        user.save()
        return Response({"detail": "Phone number has been updated successfully."}, status=status.HTTP_200_OK)

class PasswordChangeView(APIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        new_password = serializer.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password has been updated successfully."}, status=status.HTTP_200_OK)


class VerifiedTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = VerifiedTokenObtainPairSerializer


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = GoogleLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data["code"]

        token_response = exchange_code_for_token(code)
        google_id_token = token_response.get("id_token")
        if not google_id_token:
            raise AuthenticationFailed("Google authentication failed.")

        id_info = verify_google_id_token(google_id_token)

        if not id_info.get("email_verified", False):
            raise AuthenticationFailed("Google email is not verified.")

        google_sub = id_info.get("sub")
        email = id_info.get("email")
        if not google_sub or not email:
            raise AuthenticationFailed("Google authentication failed.")

        first_name = id_info.get("given_name", "")
        last_name = id_info.get("family_name", "")

        result = resolve_google_login(
            google_sub=google_sub,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        return Response(result, status=status.HTTP_200_OK)


class GoogleSignupView(APIView):
    permission_classes = [AllowAny]
    serializer_class = GoogleSignupSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(build_google_auth_tokens(user), status=status.HTTP_201_CREATED)


class SetupAdminView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        from django.core.cache import cache
        import secrets
        invite_data = cache.get(f"admin_invite:{token}")
        if not invite_data:
            return Response({"detail": "Invalid or expired setup token."}, status=status.HTTP_400_BAD_REQUEST)        
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phonenumber = request.data.get('phonenumber')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        if not all([first_name, last_name, phonenumber, password]):
            return Response({"detail": "All fields (first_name, last_name, phonenumber, password) are required."}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        from core.tenant_context import get_tenant_db
        db_alias = get_tenant_db()
        if db_alias == 'default':
            return Response({"detail": "Must access via client subdomain to setup account."}, status=status.HTTP_400_BAD_REQUEST)
        email = invite_data['email']
        username = email.split('@')[0][:30]        
        if User.objects.db_manager(db_alias).filter(email=email).exists():
            return Response({"detail": "Administrator account already set up."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.db_manager(db_alias).filter(username=username).exists():
            username = f"{username}_{secrets.token_hex(3)}"
        try:
            admin_user = User.objects.db_manager(db_alias).create_user(
                email=email,
                username=username,
                phonenumber=phonenumber,
                first_name=first_name,
                last_name=last_name,
                password=password,
                role='ADMIN',
                email_verified=True
            )
            cache.delete(f"admin_invite:{token}")           
            return Response({"detail": "Administrator account set up successfully!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": f"Failed to setup account: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)