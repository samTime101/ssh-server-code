from rest_framework_mongoengine import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from mongo.models import Constraint
from core.permissions.permissions import IsAdminUser
from core.pagination import StandardResultsSetPagination
from core.mixins.constraint_mixin import ConstraintValidatorMixin
from .serializers import ConstraintSerializer, ConstraintValidateSerializer


class ConstraintViewSet(ConstraintValidatorMixin, viewsets.ModelViewSet):
    queryset = Constraint.objects.all()
    serializer_class = ConstraintSerializer
    lookup_field = "id"
    lookup_value_regex = '[0-9a-f]{24}'
    http_method_names = ['get', 'post', 'put', 'delete']
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'], url_path='validate', serializer_class=ConstraintValidateSerializer, permission_classes=[IsAdminUser])
    def validate_constraint(self, request, *args, **kwargs):
        constraint = self.get_object()
        serializer = ConstraintValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        questions = serializer.validated_data['question_ids']

        try:
            self.validate_questions_against_constraint(questions, constraint)
        except ValidationError as exc:
            return Response({'valid': False, 'detail': "Constraint not satisfied."}, status=200)

        return Response({'valid': True, 'detail': 'Questions satisfy the constraint.'}, status=200)