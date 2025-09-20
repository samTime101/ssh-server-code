# SAMIP REGMI
# AUGUST 23

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .serializers import QuestionSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.exceptions import PermissionDenied
from mongodb_app.mongo import Question
from utils.responses.create_question_response import build_create_response
class CreateQuestionView(APIView):

    permission_classes = [IsAuthenticated]
    @extend_schema(request=QuestionSerializer)
    def post(self, request: Request) -> Response:

        if not request.user.is_superuser and not request.user.is_staff:
            raise PermissionDenied("You do not have permission to perform this action")

        serializer = QuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.save() 
        return build_create_response(question)
