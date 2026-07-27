from django.core import signing
from rest_framework import serializers

from .generate import (
    GOOGLE_SIGNUP_PURPOSE,
    GOOGLE_SIGNUP_SALT,
    GOOGLE_SIGNUP_TOKEN_MAX_AGE,
)


def verify_google_signup_token(token: str) -> dict:
    try:
        data = signing.loads(
            token,
            salt=GOOGLE_SIGNUP_SALT,
            max_age=GOOGLE_SIGNUP_TOKEN_MAX_AGE,
        )
    except signing.SignatureExpired as exc:
        raise serializers.ValidationError(
            {"signup_token": ["Signup token has expired."]}
        ) from exc
    except signing.BadSignature as exc:
        raise serializers.ValidationError(
            {"signup_token": ["Invalid signup token."]}
        ) from exc

    if not isinstance(data, dict) or data.get("purpose") != GOOGLE_SIGNUP_PURPOSE:
        raise serializers.ValidationError(
            {"signup_token": ["Invalid signup token."]}
        )

    required_keys = ("email", "google_sub", "first_name", "last_name")
    if not all(data.get(key) is not None for key in ("email", "google_sub")):
        raise serializers.ValidationError(
            {"signup_token": ["Invalid signup token."]}
        )
    for key in required_keys:
        if key not in data:
            raise serializers.ValidationError(
                {"signup_token": ["Invalid signup token."]}
            )

    return data
