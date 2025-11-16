# Nov 2
# Samip Regmi
# Views file
# Endpoint /api/question/<>

from rest_framework_mongoengine import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from mongo.models import Question
from api.questions.serializers.question import *
from api.questions.serializers.hierarchy import *
from api.questions.serializers.selection import *
from core.heirarchy import get_heirarchy
from core.selection import get_questions_by_selection
from core.pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.parsers import JSONParser
from core.parser import QuestionMultipartJsonParser
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.exceptions import NotFound

# For drf-spectacular exclude POST/PUT/PATCH methods on UI
@extend_schema_view(
    create=extend_schema(exclude=True),
    update=extend_schema(exclude=True),
    partial_update=extend_schema(exclude=True),
)

class QuestionViewSet(viewsets.ModelViewSet):
    # Core CRUD handled under this viewset automatically
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'put','post', 'delete']
    # Instead of pk it shall look for id
    lookup_field = 'id' 
    # id field regex (was complaining when server was running)
    lookup_value_regex = '[0-9a-f]{24}'
    # Parsing: accept custom multipart JSON (for file uploads) and regular JSON
    # This allows frontend to send either multipart/form-data with a 'data' field
    # (stringified JSON) or application/json payloads.
    parser_classes = [QuestionMultipartJsonParser]
    permission_classes = [IsAdminUser]

    # For api/questions/hierarchy/
    @action(detail=False,methods=['get'],url_path='hierarchy',serializer_class=HierarchySerializer,permission_classes=[IsAuthenticated])
    def hierarchy(self, request):
        # definition under core/hierarchy
        hierarchy_data = get_heirarchy()
        serializer = self.get_serializer(hierarchy_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # For question selection
    # /api/question/select/
    @extend_schema(request=QuestionSelectionSerializer, responses=QuestionPublicSerializer(many=True))
    @action(detail=False, methods=['post'],url_path='select',serializer_class=QuestionSelectionSerializer,permission_classes=[IsAuthenticated],parser_classes=[JSONParser])
    def select(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category_ids = request.data.get('category_ids', [])
        sub_category_ids = request.data.get('sub_category_ids', [])
        queryset = get_questions_by_selection(category_ids, sub_category_ids)
        if not queryset:
            raise NotFound("No questions found for selected categories")
        response_data = QuestionPublicSerializer(queryset, many=True)
        return Response(response_data.data, status=status.HTTP_200_OK)