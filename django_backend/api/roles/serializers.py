from rest_framework.serializers import ModelSerializer
from sql.models import Role

class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'created_at', 'updated_at']
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
