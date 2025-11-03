# SAMIP REGMI
# SEP 19

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from mongodb_app.mongo import SubmissionCollection
from rest_framework.request import Request
from .serializers import UserHistoryResponseSerializer
from rest_framework.exceptions import NotFound
from drf_spectacular.utils import extend_schema 
from rest_framework import status

class UserAttemptHistory(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(responses=UserHistoryResponseSerializer)

    def get(self, request: Request) -> Response:
        user = request.user
        userGuid = str(user.userGuid)
        data = SubmissionCollection.objects(userGuid=userGuid).first()
        if not data:
            raise NotFound("No attempt history found for the user")
            
        attempts = []
        for attempt in data.attempts:
            attempts.append({
                "questionId": attempt.question.id,
                "selectedAnswers": attempt.selectedAnswers,
                "isCorrect": attempt.isCorrect,
                "attemptedAt": attempt.attemptedAt
            })
        response_serializer = UserHistoryResponseSerializer({
            "userGuid": userGuid,
            "attempts": attempts
        })
        return Response(response_serializer.data, status=status.HTTP_200_OK)
