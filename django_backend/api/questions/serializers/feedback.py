from rest_framework import serializers
from rest_framework_mongoengine import serializers as me_serializers
from mongo.models import QuestionFeedback


class QuestionFeedbackSerializer(me_serializers.DocumentSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = QuestionFeedback
        fields = ("id", "feedback", "created_at","user_guid", "question")
        extra_kwargs = {'created_at': {'read_only': True}, 'user_guid': {'read_only': True}, 'question': {'read_only': True}}

    def validate_feedback(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Feedback is required.")
        return value