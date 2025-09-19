# SAMIP REGMI
# SEP 19

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from mongodb_app.mongo import SubmissionCollection

# USER CAN SELECT SO NO CHECKING OF IS STAFF OR SUPERUSER

class UserAttemptHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        userId = str(user.id)       

        # CHECK IF ATTEMPT DATA FOR USER EXISTS
        data = SubmissionCollection.objects(userId=userId).first()
        
        if not data:
            response_data = {
                "error": "No attempt history found for the user"
                }
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        # SERIALIZING THE DATA
        attempts = []
        for attempt in data.attempts:
            attempts.append({
                "questionId": attempt.questionId,
                "selectedAnswers": attempt.selectedAnswers,
                "isCorrect": attempt.isCorrect,
                "attemptedAt": attempt.attemptedAt
            })

        response_data = {
            "userId": data.userId,
            "started_at": data.started_at,
            "attempts": attempts
        }

        return Response(response_data, status=status.HTTP_200_OK)

