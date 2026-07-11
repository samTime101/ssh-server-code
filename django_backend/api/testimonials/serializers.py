from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from core.cloudinary import delete_testimonial_image, upload_testimonial_image
from mongo.models import Testimonial


class TestimonialSerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)
    image = serializers.ImageField(write_only=True, required=False, allow_null=True)
    image_url = serializers.CharField(read_only=True)

    class Meta:
        model = Testimonial
        fields = ["id", "name", "message", "image", "image_url", "created_at", "updated_at"]
        extra_kwargs = {"created_at": {"read_only": True},"updated_at": {"read_only": True},"image_url": {"read_only": True},}

    def validate_name(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Name is required.")
        return trimmed

    def validate_message(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Message is required.")
        return trimmed

    def create(self, validated_data):
        image_file = validated_data.pop("image", None)
        testimonial = Testimonial.objects.create(**validated_data)
        if image_file:
            testimonial.image_url = upload_testimonial_image(image_file, testimonial.id)
            testimonial.save()
        return testimonial

    def update(self, instance, validated_data):
        image_was_provided = "image" in validated_data
        image_file = validated_data.pop("image", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if image_was_provided:
            if instance.image_url:
                delete_testimonial_image(instance.id)
            if image_file is None:
                instance.image_url = None
            else:
                instance.image_url = upload_testimonial_image(image_file, instance.id)
        instance.save()
        return instance
