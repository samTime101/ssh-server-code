from rest_framework import serializers


class QuestionBankStatsSerializer(serializers.Serializer):
    total_questions = serializers.IntegerField()
    question_bank_submissions = serializers.IntegerField()
    latest_attempts_count = serializers.IntegerField()
    latest_correct_attempts = serializers.IntegerField()
    latest_incorrect_attempts = serializers.IntegerField()
    unique_questions_attempted = serializers.IntegerField()
    questions_coverage_percent = serializers.FloatField()
    accuracy_percent = serializers.FloatField()


class TopicWiseStatsSerializer(serializers.Serializer):
    topic = serializers.CharField()
    attempted_count = serializers.IntegerField()
    accuracy_percent = serializers.FloatField()
    average_response_time_seconds = serializers.FloatField()
