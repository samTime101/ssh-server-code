# api/notes/views.py

from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from core.constants.status import APPROVED_STATUS
from core.pagination import StandardResultsSetPagination
from core.permissions.permissions import IsAuthenticated
from mongo.models import Question, QuestionNote
from api.notes.serializers import QuestionNoteSerializer


# /api/notes/<str:question_id>/
class QuestionNoteDetailViewSet(ModelViewSet):
    serializer_class = QuestionNoteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        question_id = self.kwargs.get('question_id')

        return QuestionNote.objects(question=question_id,user_guid=self.request.user.user_guid)

    def perform_create(self, serializer):
        question_id = self.kwargs.get('question_id')

        try:
            question = Question.objects.get(id=question_id,status=APPROVED_STATUS)

        except Question.DoesNotExist:
            raise NotFound(detail="Question not found or not approved.")

        serializer.save(question=question,user_guid=self.request.user.user_guid)