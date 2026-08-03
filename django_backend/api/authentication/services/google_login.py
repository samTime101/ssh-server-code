from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from core.token.google_signup.generate import create_google_signup_token

User = get_user_model()


def _truncate(value, max_length):
    return (value or "")[:max_length]


def build_google_auth_tokens(user):
    from api.authentication.serializers import GoogleExistingUserSerializer

    refresh = RefreshToken.for_user(user)
    return {
        "is_new_user": False,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": GoogleExistingUserSerializer(user).data,
    }


def resolve_google_login(*, google_sub: str, email: str, first_name: str, last_name: str):
    """
    Resolve an authenticated Google identity to either JWT credentials or a
    short-lived signup_token for new users.
    """
    first_name = _truncate(first_name, 20)
    last_name = _truncate(last_name, 20)

    user_by_sub = User.objects.filter(google_sub=google_sub).first()
    if user_by_sub is not None:
        return build_google_auth_tokens(user_by_sub)

    user_by_email = User.objects.filter(email=email).first()

    if user_by_email is None:
        signup_token = create_google_signup_token(
            email=email,
            google_sub=google_sub,
            first_name=first_name,
            last_name=last_name,
        )
        return {
            "is_new_user": True,
            "signup_token": signup_token,
            "profile": {
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
            },
        }

    if not user_by_email.is_email_verified:
        raise AuthenticationFailed(
            "Please verify your email address before signing in with Google."
        )

    if user_by_email.google_sub is None:
        user_by_email.google_sub = google_sub
        user_by_email.save(update_fields=["google_sub"])
        return build_google_auth_tokens(user_by_email)

    if user_by_email.google_sub == google_sub:
        return build_google_auth_tokens(user_by_email)

    raise AuthenticationFailed(
        "This email is already linked to a different Google account."
    )
