# REFERENCE https://stackoverflow.com/questions/59531746/login-using-django-rest-framework

# MODIFIED AUGUST 25

from rest_framework import serializers
from django.contrib.auth import authenticate
# MODIFIED ON SEP 11 , SAMIP REGMI

# STADARD DJANGO EXCEPTION RAISED FOR AUTHENTICATION FAILED
# 401 UNAUTHORIZED
from rest_framework.exceptions import AuthenticationFailed

class UserSignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    # IF I GET MORE FIELDS IN POST REQUEST INVALIDATE THEM

    def no_extra_fields(self, data):
        allowed = set(['email', 'password'])
        received = set(data.keys())
        extra = received - allowed
        if extra:
            raise serializers.ValidationError(f"extra fields detected: {extra}")
        return data

    def validate(self, data):
        # SEND EXACT FIELDS SEND BY USER
        self.no_extra_fields(self.initial_data)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required")

        user = authenticate(username=email, password=password)
        if not user:
            raise AuthenticationFailed("Invalid email or password")

        if not user.is_active:
            raise AuthenticationFailed("User account is disabled")

        data['user'] = user
        return data
