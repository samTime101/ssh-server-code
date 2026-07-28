from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer
from mongo.models import Reaction, Question
from core.constants.status import APPROVED_STATUS

class ReactionSerializer(DocumentSerializer):
    class Meta:
        model = Reaction
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "user_guid": {"read_only": True},
        }

    def validate(self, attrs):
        question_ref = attrs["question"]
        question = Question.objects(id=question_ref.id).first()
        if not question:
            raise serializers.ValidationError({"question": "Question does not exist."})
        if question.status != APPROVED_STATUS:
            raise serializers.ValidationError({"question": "You can only react to approved questions."})
        attrs["question"] = question
        return attrs