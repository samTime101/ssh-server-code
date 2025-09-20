# SAMIP REGMI
# AUGUST 23

# CODE TEMPLATE FROM CREATE_QUESTION/VIEW.PY

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import SelectQuestionSerializer
from drf_spectacular.utils import extend_schema

# USER CAN SELECT SO NO CHECKING OF IS STAFF OR SUPERUSER

class SelectQuestionView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(request=SelectQuestionSerializer)

    def post(self, request):
        serializer = SelectQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        questions = serializer.get_questions()

        # RETURNING CUSTOM RESPONSE
        question_list = []
        for question in questions:
            question_list.append({
                "id": str(question.id),  
                "questionText": question.questionText,
                "description": question.description,
                "questionType": question.questionType,
                "options": [{"optionId": option.optionId, "text": option.text} for option in question.options],
                "correctAnswers": question.correctAnswers,
                "difficulty": question.difficulty,
                "category": question.category,
                "subCategory": question.subCategory,
                "subSubCategory": question.subSubCategory,
                "createdAt": question.createdAt,
                "updatedAt": question.updatedAt,
            })
        response_data = {
            "questions": question_list
        }
        return Response(response_data, status=status.HTTP_200_OK)
