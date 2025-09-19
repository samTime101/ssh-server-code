from rest_framework import serializers

class UserAttemptSerializer(serializers.Serializer):
    questionId = serializers.CharField()
    selectedAnswers = serializers.ListField(child=serializers.CharField())
