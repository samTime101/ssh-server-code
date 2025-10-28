from rest_framework import serializers

class AttemptSerializer(serializers.Serializer):
    questionId = serializers.CharField()
    selectedAnswers = serializers.ListField(child=serializers.CharField())
    isCorrect = serializers.BooleanField()
    attemptedAt = serializers.DateTimeField()


class UserHistoryResponseSerializer(serializers.Serializer):
    userGuid = serializers.UUIDField()
    attempts = AttemptSerializer(many=True)