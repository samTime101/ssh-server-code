from rest_framework_mongoengine import viewsets
from core.constants.status import IN_PROGRESS_STATUS
from mongo.models import QuestionSet, Submissions
from rest_framework.exceptions import NotFound
from .serializers import QuestionSetSerializer
from core.permissions.permissions import IsAdminUser, IsAuthenticated
from core.pagination import QuestionResultsSetPagination
from api.questions.serializers.question import QuestionPublicSerializer
import random

class QuestionSetViewSet(viewsets.ModelViewSet):
    queryset = QuestionSet.objects.all()
    http_method_names = ['get', 'post', 'put', 'delete']
    permission_classes = [IsAdminUser]
    pagination_class = QuestionResultsSetPagination
    lookup_field = "id"
    lookup_value_regex = '[0-9a-f]{24}'
    serializer_class = QuestionSetSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticated()]
        return [IsAdminUser()]
    
    def retrieve(self, request, *args, **kwargs):
            instance = self.get_object()
            user_guid = getattr(request.user, "user_guid", None)
            queryset = instance.questions
            if not queryset:
                raise NotFound("No questions found in this set.")
            page = self.paginate_queryset(queryset)
            selected_questions = list(page) if page is not None else list(queryset)
            question_set_name = instance.name
            # shuffle the questions
            random.shuffle(selected_questions)
            submission = Submissions(user_guid=user_guid,selected_questions=selected_questions,attempts=[],status=IN_PROGRESS_STATUS,type=f"set_{question_set_name}")
            submission.save()
            serializer = QuestionPublicSerializer(selected_questions, many=True)
            self.paginator.submission_id = str(submission.id)
            return self.get_paginated_response(serializer.data)