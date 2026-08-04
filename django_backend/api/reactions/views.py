from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import action
from rest_framework_mongoengine.viewsets import ModelViewSet

from mongo.models import Question, Reaction
from core.constants.status import APPROVED_STATUS
from core.pagination import StandardResultsSetPagination
from core.permissions.permissions import IsAuthenticated, IsAdminUser
from .serializers import ReactionSerializer


class ReactionViewSet(ModelViewSet):
    queryset = Reaction.objects.all()
    serializer_class = ReactionSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "post", "delete"]

    lookup_field = "id"
    lookup_value_regex = "[0-9a-f]{24}"

    def get_permissions(self):
        if self.action in ["list", "create", "check", "count"]:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.validated_data["question"]
        reaction_type = serializer.validated_data["reaction_type"]

        reaction = Reaction.objects(user_guid=request.user.user_guid,question=question,).first()

        if reaction:
            if reaction.reaction_type != reaction_type:
                reaction.reaction_type = reaction_type
                reaction.save()

            return Response(self.get_serializer(reaction).data,status=status.HTTP_200_OK,)

        reaction = Reaction(user_guid=request.user.user_guid,question=question,reaction_type=reaction_type,)
        reaction.save()

        return Response(self.get_serializer(reaction).data,status=status.HTTP_201_CREATED,)

    @action(detail=False, methods=["get"], url_path=r"count/(?P<question_id>[0-9a-f]{24})")
    def count(self, request, question_id=None):
        question = Question.objects(id=question_id,status=APPROVED_STATUS,).first()

        if not question:
            raise NotFound("Question not found.")

        return Response({
            "question_id": question_id,
            "likes": Reaction.objects(question=question, reaction_type="like").count(),
            "dislikes": Reaction.objects(question=question, reaction_type="dislike").count(),
        })

    @action(detail=False, methods=["get"], url_path=r"check/(?P<question_id>[0-9a-f]{24})")
    def check(self, request, question_id=None):
        question = Question.objects(id=question_id,status=APPROVED_STATUS,).first()

        if not question:
            raise NotFound("Question not found.")

        reaction = Reaction.objects(question=question,user_guid=request.user.user_guid,).first()

        return Response({
            "question_id": question_id,
            "reaction_type": reaction.reaction_type if reaction else None,
        })