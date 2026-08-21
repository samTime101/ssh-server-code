from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import Client
from core.cloudinary import upload_client_image, delete_client_image

class ClientSerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)
    pan_photo = serializers.ImageField(write_only=True, required=False, allow_null=True)
    registration_photo = serializers.ImageField(write_only=True, required=True)

    class Meta:
        model = Client
        fields = [
            "id", "organization_name", "address", "pan", "registration_number",
            "pan_photo", "pan_photo_url", "registration_photo", "registration_photo_url",
            "phonenumber", "email", "created_at", "updated_at"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "pan_photo_url": {"read_only": True},
            "registration_photo_url": {"read_only": True},
        }

    def create(self, validated_data):
        pan_photo_file = validated_data.pop("pan_photo", None)
        registration_photo_file = validated_data.pop("registration_photo", None)
        validated_data["registration_photo_url"] = "pending"
        client = Client.objects.create(**validated_data)
        
        if pan_photo_file:
            client.pan_photo_url = upload_client_image(pan_photo_file, client.id, "pan")
        if registration_photo_file:
            client.registration_photo_url = upload_client_image(registration_photo_file, client.id, "registration")
            
        client.save()
        return client

    def update(self, instance, validated_data):
        pan_photo_provided = "pan_photo" in validated_data
        registration_photo_provided = "registration_photo" in validated_data
        
        pan_photo_file = validated_data.pop("pan_photo", None)
        registration_photo_file = validated_data.pop("registration_photo", None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if pan_photo_provided:
            if instance.pan_photo_url:
                delete_client_image(instance.id, "pan")
            if pan_photo_file is None:
                instance.pan_photo_url = None
            else:
                instance.pan_photo_url = upload_client_image(pan_photo_file, instance.id, "pan")
                
        if registration_photo_provided:
            if instance.registration_photo_url:
                delete_client_image(instance.id, "registration")
            if registration_photo_file is None:
                instance.registration_photo_url = None
            else:
                instance.registration_photo_url = upload_client_image(registration_photo_file, instance.id, "registration")
                
        instance.save()
        return instance

