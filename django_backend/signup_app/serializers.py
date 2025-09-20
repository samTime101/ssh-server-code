# REFERENCE https://forum.djangoproject.com/t/correct-way-to-let-user-register-sign-up-with-drf/1370
# ADDED BY SAMIP REGMI

from rest_framework import serializers
from sqldb_app.models import User

class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # SERIALIZE FIELDS, WILL RETURN ALL FIELDS EXCEPT PASS IN GET REQUEST
        fields = ['email', 'username', 'phonenumber', 'firstname', 'lastname', 'password']
        # DONT RETURN PASSWORD IN RESPONSE
        extra_kwargs = {'password': {'write_only': True}} 

    def create(self, validated_data):
        #PASSWORD HASHING AND SAVING IS ALREADY HANDLED BY USER MODEL
        user = User.objects.create_user(**validated_data , is_active=True, is_staff=False ,is_superuser=False)
        return user
