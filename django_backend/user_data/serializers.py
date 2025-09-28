from rest_framework import serializers

class UserDataResponseSerializer(serializers.Serializer):
    userId = serializers.IntegerField(source='id')
    email = serializers.EmailField()
    username = serializers.CharField()
    phonenumber = serializers.CharField(allow_blank=True, required=False)
    firstname = serializers.CharField(allow_blank=True, required=False)
    lastname = serializers.CharField(allow_blank=True, required=False)
    is_active = serializers.BooleanField()
    is_staff = serializers.BooleanField()
    is_superuser = serializers.BooleanField()