# Ishan Upadhyay
#May 22 2026
import re
from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import Feedback

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


class FeedbackCreateSerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)
    email = serializers.CharField(required=True, max_length=254)
    feedback = serializers.CharField(required=True, max_length=2000)

    class Meta:
        model = Feedback
        fields = ["id", "email", "feedback", "created_at"]
        extra_kwargs = {"created_at": {"read_only": True}}

    def validate_email(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Email is required.")
        if not EMAIL_REGEX.match(trimmed):
            raise serializers.ValidationError("Invalid email format.")
        return trimmed

    def validate_feedback(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Feedback is required.")
        return trimmed


class FeedbackAdminSerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Feedback
        fields = ["id", "email", "feedback", "created_at", "updated_at"]
        extra_kwargs = {
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
