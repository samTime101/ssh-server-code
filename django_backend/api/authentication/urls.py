from django.urls import path, include
from .views import SignupView, EmailVerifyView, ResetPasswordView, ResetPhoneNumberView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='auth_signup'),
    path('auth/signin/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify-email/<str:token>/', EmailVerifyView.as_view(), name='email_verify'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('auth/reset-phonenumber/', ResetPhoneNumberView.as_view(), name='reset_phonenumber'),
]
