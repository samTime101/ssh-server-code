import datetime
from rest_framework import serializers
from mongodb_app.mongo import SubmissionCollection, Question ,Submissions  

class UserAttemptSerializer(serializers.Serializer):
    questionId = serializers.CharField()
    selectedAnswers = serializers.ListField(child=serializers.CharField())

    def validate_questionId(self, value):
        if not value:
            raise serializers.ValidationError("questionId cannot be empty")
        return value

    def check_question_exists(self, questionId):
        question = Question.objects(questionId=questionId).first()
        if not question:
            raise serializers.ValidationError(f"Question with id {questionId} does not exist")
        return question
    
    def create(self, validated_data):
        questionId = validated_data['questionId']
        selectedAnswers = validated_data['selectedAnswers']
        question = self.check_question_exists(questionId)
        user = self.context['request'].user
        correctAnswers = set(question.correctAnswers)
        userAnswers = set(selectedAnswers)
        isCorrect = correctAnswers == userAnswers
        attemptedAt = datetime.utcnow()

        data = {
            "userId": user.id,
            "questionId": questionId,
            "selectedAnswers": selectedAnswers,
            "isCorrect": isCorrect,
            "attemptedAt": attemptedAt
        }

        submission = SubmissionCollection(userId=user.id).first()
        if submission:
            new_submission = Submissions(**data)
            submission.attempts.append(new_submission)
            submission.save()
            return new_submission
        else:
            new_submission = Submissions(**data)
            submission = SubmissionCollection(userId=user.id, attempts=[new_submission])
            submission.save()
            return new_submission
        

class UserAttemptResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()