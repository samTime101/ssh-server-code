# Samip Regmi
# Signup Serializer

from rest_framework import serializers
from django.contrib.auth import get_user_model

# SQL model for auth
User = get_user_model()

# Signup ma k liney
class SignUpSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name','phonenumber', 'college', 'confirm_password')
        extra_kwargs = { 'password': {'write_only': True} }
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
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
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError("New passwords do not match.")
        return data

class ResetPhoneNumberSerializer(serializers.Serializer):
    new_phonenumber = serializers.CharField(required=True)