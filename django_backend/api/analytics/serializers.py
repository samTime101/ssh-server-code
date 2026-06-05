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
