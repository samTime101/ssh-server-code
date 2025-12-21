# Samip Regmi
# Signup Serializer

from rest_framework import serializers
from django.contrib.auth import get_user_model

# SQL model for auth
User = get_user_model()

# Signup ma k liney
class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name','phonenumber', 'college')
        extra_kwargs = { 'password': {'write_only': True} }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Response ma k send garne
class SignupResponseSerializer(serializers.ModelSerializer):
    detail = serializers.CharField(default="User registered successfully")
    class Meta:
        model = User
        fields = ('detail','user_guid','email','username','phonenumber','first_name','last_name','college')
        read_only_fields = fields
