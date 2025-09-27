# SAMIP REGMI
# AUGUST 23

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateQuestionResponseSerializer, QuestionSerializer 
from drf_spectacular.utils import extend_schema,OpenApiExample
from rest_framework.exceptions import PermissionDenied
class CreateQuestionView(APIView):

    permission_classes = [IsAuthenticated]
    # @extend_schema(request=QuestionSerializer, responses=CreateQuestionResponseSerializer)
    @extend_schema(
    request=QuestionSerializer,
    responses=CreateQuestionResponseSerializer,
    examples=[
        OpenApiExample(
            "Example Create Question Request",
            summary="Example request to create a question",
            value={
                "questionText": "WHAT IS GOING ON",
                "description": "Some explanation here",
                "questionType": "multiple",
                "options": [
                    {"optionId": "A", "text": "for"},
                    {"optionId": "B", "text": "while"},
                    {"optionId": "C", "text": "switch"},
                    {"optionId": "D", "text": "do-while"}
                ],
                "correctAnswers": ["A", "B", "D"],
                "difficulty": "easy",
                "categoryId": 1,
                "subCategoryIds": [],
                "subSubCategoryIds": []
            },
            request_only=True,
            response_only=False
        )
    ]
)
    def post(self, request: Request) -> Response:

        if not request.user.is_superuser and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to perform this action")

        serializer = QuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.save() 
        response_serializer = CreateQuestionResponseSerializer({
            "detail": "Question created successfully",
            "questionId": str(question.id)
        })
        return Response(response_serializer.data, status=201)

