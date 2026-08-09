from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer

from mongo.models import Question, Reaction
from core.constants.status import APPROVED_STATUS


class ReactionSerializer(DocumentSerializer):
    class Meta:
        model = Reaction
        fields = ("id", "question", "reaction_type", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_question(self, question):
        question = Question.objects(id=question.id).first()

        if not question:
            raise serializers.ValidationError("Question does not exist.")

        if question.status != APPROVED_STATUS:
            raise serializers.ValidationError(
                "You can only react to approved questions."
            )

        return question