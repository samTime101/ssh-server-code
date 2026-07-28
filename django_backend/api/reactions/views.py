from rest_framework_mongoengine.viewsets import ModelViewSet
# from rest_framework.permissions import AllowAny, IsAdminUser
from core.permissions.permissions import AllowAny, IsAdminUser
from mongo.models import Question, Reaction
from core.pagination import StandardResultsSetPagination
from .serializers import ReactionSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from core.constants.status import APPROVED_STATUS

class ReactionViewSet(ModelViewSet):
    queryset = Reaction.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = ReactionSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'delete', 'put', 'patch']
    lookup_field = 'id'
    lookup_value_regex = '[0-9a-f]{24}'

    def get_permissions(self):
        if self.action in ['list']:
            self.permission_classes = [AllowAny]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(user_guid=self.request.user.user_guid)

    @action(detail=False, methods=["get"], url_path=r"count/(?P<question_id>[0-9a-f]{24})")
    def count(self, request, question_id=None):
        question = Question.objects(id=question_id, status=APPROVED_STATUS).first()
        if not question:
            raise NotFound("Question not found.")
        likes = Reaction.objects(question=question_id,reaction_type="like").count()
        dislikes = Reaction.objects(question=question_id,reaction_type="dislike").count()
        return Response({
            "question_id": question_id,
            "likes": likes,
            "dislikes": dislikes,
        })