from rest_framework import serializers

class UserDataResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    userGuid = serializers.UUIDField()
    email = serializers.EmailField()
    username = serializers.CharField()
    phonenumber = serializers.CharField(allow_blank=True, required=False)
    firstname = serializers.CharField(allow_blank=True, required=False)
    lastname = serializers.CharField(allow_blank=True, required=False)
    is_active = serializers.BooleanField()
    is_staff = serializers.BooleanField()
    is_superuser = serializers.BooleanField()