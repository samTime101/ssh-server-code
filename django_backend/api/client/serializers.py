from rest_framework import serializers
from sql.models import Client
from core.services.provisioner import provision_tenant_databases

class ClientSerializer(serializers.ModelSerializer):
    pan_photo = serializers.ImageField(source='pan_photo_url', write_only=True, required=True)
    registration_photo = serializers.ImageField(source='registration_photo_url', write_only=True, required=True)
    subdomain = serializers.CharField(required=True)
    database_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    mongo_database_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Client
        fields = [
            "id", "organization_name", "address", "pan", "registration_number",
            "pan_photo", "pan_photo_url", 
            "registration_photo", "registration_photo_url",
            "phonenumber", "email", "subdomain", "database_name", "mongo_database_name", "status", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "pan_photo_url", "registration_photo_url", "status"]

    def create(self, validated_data):
        pan_photo = validated_data.pop('pan_photo_url', None)
        registration_photo = validated_data.pop('registration_photo_url', None)
        custom_sql_db = validated_data.pop('database_name', None)
        custom_mongo_db = validated_data.pop('mongo_database_name', None)

        validated_data['status'] = 'PROVISIONING'
        client = super().create(validated_data)

        if pan_photo:
            client.pan_photo_url = pan_photo
        if registration_photo:
            client.registration_photo_url = registration_photo
        client.save()

        try:
            provision_tenant_databases(
                client,
                custom_sql_db=custom_sql_db,
                custom_mongo_db=custom_mongo_db
            )
        except Exception as e:
            client.delete()
            raise serializers.ValidationError({"detail": f"Database provisioning failed: {str(e)}"})

        return client

    def update(self, instance, validated_data):
        new_pan_photo = validated_data.get('pan_photo_url')
        new_registration_photo = validated_data.get('registration_photo_url')
        if new_pan_photo and instance.pan_photo_url:
            instance.pan_photo_url.delete(save=False)
        if new_registration_photo and instance.registration_photo_url:
            instance.registration_photo_url.delete(save=False)
        return super().update(instance, validated_data)
