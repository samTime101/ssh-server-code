from django.urls import path, include
from .views import SignupView,EmailVerifyView,VerifyEmailRequestView,ResetPasswordView,ResetPhoneNumberView,PasswordResetVerifyView,VerifiedTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='auth_signup'),
    path('auth/signin/', VerifiedTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify-email/<str:token>/', EmailVerifyView.as_view(), name='email_verify'),
    path('auth/verify-email-request/', VerifyEmailRequestView.as_view(), name='email_verify_request'),
    path('auth/reset-password-request/', ResetPasswordView.as_view(), name='reset_password_request'),
    path('auth/reset-password-verify/<str:token>/', PasswordResetVerifyView.as_view(), name='reset_password_verify'),
    path('auth/reset-phonenumber/', ResetPhoneNumberView.as_view(), name='reset_phonenumber'),
]
