from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from mongodb_app.mongo import SubmissionCollection, Question ,Submissions
from datetime import datetime

class UserAttemptView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        userId = str(user.id)
        questionId = request.data.get('questionId')
        selectedAnswers = request.data.get('selectedAnswers', [])

        # CHECK IF QUESTION EXISTS
        try:
            question = Question.objects.get(id=questionId)

        except Question.DoesNotExist:
            response_data = {
                "error": "Question not found"
                }
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        # CHECK IF ANSWERS ARE CORRECT
        correctAnswers = set(question.correctAnswers)
        userSelectedAnswers = set(selectedAnswers)
        isCorrect = correctAnswers == userSelectedAnswers
        attemptedAt = datetime.utcnow()


        # CHECK IF DATA EXISTS

        data = SubmissionCollection.objects(userId=userId).first()
        
        if data:
            newdata = Submissions(questionId=questionId, selectedAnswers=selectedAnswers, isCorrect=isCorrect, attemptedAt=attemptedAt)
            data.attempts.append(newdata)
            data.save()
            response_data = {
                "message": "Attempt recorded",
            }
            return Response(response_data, status=status.HTTP_201_CREATED)


        user_attempt = SubmissionCollection(
            userId=userId,
            attempts=[{
                "questionId": questionId,
                "selectedAnswers": selectedAnswers,
                "isCorrect": isCorrect,
                "attemptedAt": attemptedAt
            }],
            started_at = datetime.utcnow()
        )

        user_attempt.save()
        response_data = {
            "message": "Attempt recorded",
        }
        return Response(response_data, status=status.HTTP_201_CREATED)