from rest_framework import serializers

class UserSignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class UserSerializer(serializers.Serializer):
    userId = serializers.CharField()
    email = serializers.EmailField()
    username = serializers.CharField()
    phonenumber = serializers.CharField(allow_null=True, required=False)
    firstname = serializers.CharField(allow_null=True, required=False)
    lastname = serializers.CharField(allow_null=True, required=False)
    is_active = serializers.BooleanField()
    is_staff = serializers.BooleanField()
    is_superuser = serializers.BooleanField()

class TokensSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

class UserSignInResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(default="User signed in successfully")
    user = UserSerializer()
    tokens = TokensSerializer()