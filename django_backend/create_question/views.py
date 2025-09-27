# SAMIP REGMI
# AUGUST 23

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateQuestionResponseSerializer, QuestionSerializer 
from drf_spectacular.utils import extend_schema,OpenApiExample
from rest_framework.exceptions import PermissionDenied
from .example import CreateQuestionRequestExample
from rest_framework import status
class CreateQuestionView(APIView):

    permission_classes = [IsAuthenticated]
    # @extend_schema(request=QuestionSerializer, responses=CreateQuestionResponseSerializer)
    @extend_schema(
    request=QuestionSerializer,
    responses=CreateQuestionResponseSerializer,
    examples=[
        OpenApiExample(
            name=CreateQuestionRequestExample.name,
            summary=CreateQuestionRequestExample.summary,
            value=CreateQuestionRequestExample.example,
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
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

