from rest_framework import serializers
from sql.models import Client

class ClientSerializer(serializers.ModelSerializer):
    pan_photo = serializers.ImageField(source='pan_photo_url', write_only=True, required=True)
    registration_photo = serializers.ImageField(source='registration_photo_url', write_only=True, required=True)

    class Meta:
        model = Client
        fields = [
            "id", "organization_name", "address", "pan", "registration_number",
            "pan_photo", "pan_photo_url", 
            "registration_photo", "registration_photo_url",
            "phonenumber", "email", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "pan_photo_url", "registration_photo_url"]

    def create(self, validated_data):
        pan_photo = validated_data.pop('pan_photo_url', None)
        registration_photo = validated_data.pop('registration_photo_url', None)        
        client = super().create(validated_data)
        if pan_photo:
            client.pan_photo_url = pan_photo
        if registration_photo:
            client.registration_photo_url = registration_photo
        if pan_photo or registration_photo:
            client.save()
        return client

    def update(self, instance, validated_data):
        new_pan_photo = validated_data.get('pan_photo_url')
        new_registration_photo = validated_data.get('registration_photo_url')
        if new_pan_photo and instance.pan_photo_url:
            instance.pan_photo_url.delete(save=False)
        if new_registration_photo and instance.registration_photo_url:
            instance.registration_photo_url.delete(save=False)
        return super().update(instance, validated_data)
