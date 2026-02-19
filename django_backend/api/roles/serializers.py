from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from core.constants.roles import ROLE_USER
from sql.models import Role

class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'created_at', 'updated_at']
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
    def validate_name(self,value):
        if value.upper() == ROLE_USER:
            raise serializers.ValidationError("USER role is virtual and cannot be created.")
        if Role.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Role with this name already exists.")
        return value