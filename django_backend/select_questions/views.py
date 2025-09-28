# REFACTORED ON SEP 20 2025
# SAMIP REGMI 

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .serializers import  SelectQuestionSerializer, QuestionResponseSerializer
from rest_framework import status
from drf_spectacular.utils import extend_schema

class SelectQuestionView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(request=SelectQuestionSerializer,responses=QuestionResponseSerializer(many=True))

    def post(self, request: Request) -> Response:
        serializer = SelectQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        questions = serializer.get_questions()
        response_serializer = QuestionResponseSerializer({
            "detail": "Questions fetched successfully",
            "questions": questions
        })
        return Response(response_serializer.data, status=status.HTTP_200_OK)
