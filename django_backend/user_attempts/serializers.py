# REFACTORED ON SEP 21 2025

from datetime import datetime
from rest_framework import serializers
from mongodb_app.mongo import SubmissionCollection, Question ,Submissions  
from bson import ObjectId

class UserAttemptSerializer(serializers.Serializer):
    questionId = serializers.CharField()
    selectedAnswers = serializers.ListField(child=serializers.CharField())
    

    def validate_questionId(self, value):
        if not value:
            raise serializers.ValidationError("questionId cannot be empty")
        return value

    def check_question_exists(self, questionId):
        question = Question.objects(id=ObjectId(questionId)).first()
        if not question:
            raise serializers.ValidationError(f"Question with id {questionId} does not exist")
        return question
    
    def create(self, validated_data):
        userId = str(self.context['user'].id)
        questionId = validated_data['questionId']
        selectedAnswers = validated_data['selectedAnswers']
        question = self.check_question_exists(questionId)
        correctAnswers = set(question.correctAnswers)
        userAnswers = set(selectedAnswers)
        isCorrect = correctAnswers == userAnswers
        attemptedAt = datetime.utcnow()
        description = question.description

        new_submission = Submissions(
            question=questionId,
            selectedAnswers=selectedAnswers,
            isCorrect=isCorrect,
            attemptedAt=attemptedAt,
            description=description
        )
        
        submission = SubmissionCollection.objects(userId=userId).first()
        if submission:
            submission.attempts.append(new_submission)
            submission.save()
        else:
            submission = SubmissionCollection(userId=userId, attempts=[new_submission])
            submission.save()
        return new_submission
        

class UserAttemptResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    isCorrect = serializers.BooleanField(required=False)
    description = serializers.CharField(required=False)