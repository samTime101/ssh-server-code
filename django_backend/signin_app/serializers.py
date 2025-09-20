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
            # CUSTOM RESPONSE DATA
            response_data = {
                "error": f"extra fields detected: {extra}"
            }
            raise serializers.ValidationError(response_data)
        return data

    def validate(self, data):
        # SEND EXACT FIELDS SEND BY USER
        self.no_extra_fields(self.initial_data)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            # CUSTOM RESPONSE DATA
            response_data = {
                "error": "Both email and password are required"
            }
            raise serializers.ValidationError(response_data)

        user = authenticate(username=email, password=password)
        if not user:
            # CUSTOM RESPONSE DATA
            response_data = {
                "error": "Invalid email or password"
            }
            raise AuthenticationFailed(response_data)

        if not user.is_active:
            # CUSTOM RESPONSE DATA
            response_data = {
                "error": "User account is disabled"
            }
            raise AuthenticationFailed(response_data)

        data['user'] = user
        return data
