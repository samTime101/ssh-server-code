from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='auth_signup'),
    path('auth/signin/', VerifiedTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('auth/google/signup/', GoogleSignupView.as_view(), name='google_signup'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify-email/<str:token>/', EmailVerifyView.as_view(), name='email_verify'),
    path('auth/setup-admin/<str:token>/', SetupAdminView.as_view(), name='setup-admin'),
    path('auth/verify-email-request/', EmailVerifyRequestView.as_view(), name='email_verify_request'),
    path('auth/forgot-password-request/', ForgotPasswordView.as_view(), name='forgot_password_request'),
    path('auth/forgot-password-verify/<str:token>/', ForgotPasswordVerifyView.as_view(), name='reset_password_verify'),
    path('auth/change-password/', PasswordChangeView.as_view(), name='change_password'),
    path('auth/change-phonenumber/', PhoneNumberChangeView.as_view(), name='change_phonenumber'),
]
