# Samip Regmi
# Signup Serializer

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_recaptcha.fields import ReCaptchaV2Field

# SQL model for auth
User = get_user_model()

# Signup ma k liney
class SignUpSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    recaptcha = ReCaptchaV2Field(write_only=True)
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name','phonenumber', 'college', 'confirm_password', 'recaptcha')
        extra_kwargs = { 'password': {'write_only': True} }
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        validated_data.pop('recaptcha', None)
        user = User.objects.create_user(**validated_data)
        return user

# Response ma k send garne
class SignupResponseSerializer(serializers.ModelSerializer):
    detail = serializers.CharField(default="Verification Email sent.")
    class Meta:
        model = User
        fields = ('detail','user_guid','email','username','phonenumber','first_name','last_name','college')
        read_only_fields = fields

class EmailVerifySerializer(serializers.Serializer):
    token = serializers.CharField()

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    recaptcha = ReCaptchaV2Field(write_only=True)
    
    def validate(self, data):
        if User.objects.filter(email=data['email']).first() is None:
            raise serializers.ValidationError("User not found.")
        return data

class ResetPasswordVerifySerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError("New passwords do not match.")
        return data

class ResetPhoneNumberSerializer(serializers.Serializer):
    new_phonenumber = serializers.CharField(required=True)

class VerifyEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if not user:
            raise serializers.ValidationError("User not found.")
        self.context["user"] = user
        return value

class VerifiedTokenObtainPairSerializer(TokenObtainPairSerializer):
    recaptcha = ReCaptchaV2Field()
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_email_verified:
            raise AuthenticationFailed("Please verify your email address before signing in.")
        return data