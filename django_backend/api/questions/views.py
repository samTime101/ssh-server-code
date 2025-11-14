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
    parser_classes = [QuestionMultipartJsonParser, JSONParser]
    permission_classes = [IsAdminUser]

    def _normalize_request_data(self, raw_data):
        """Translate frontend payload keys to serializer-expected keys.

        Frontend uses camelCase names and different option shape. Convert to:
        - question_text
        - option_type
        - options: [{label, text, is_true}]
        - sub_categories: [id,...]
        """
        # raw_data may be QueryDict or dict-like; convert to plain dict
        try:
            data = dict(raw_data)
        except Exception:
            data = raw_data

        normalized = {}

        # question text
        normalized['question_text'] = data.get('questionText') or data.get('question_text')

        # option type
        normalized['option_type'] = data.get('questionType') or data.get('option_type')

        # description and difficulty
        normalized['description'] = data.get('description') or data.get('desc') or data.get('details')
        normalized['difficulty'] = data.get('difficulty') or data.get('level')

        # options: convert from [{optionId, text}] to [{label, text, is_true}]
        raw_options = data.get('options') or []
        correct_answers = set(data.get('correctAnswers') or data.get('correct_answers') or [])
        mapped_options = []
        for opt in raw_options:
            # opt might be a dict or list item from QueryDict
            try:
                label = opt.get('optionId') or opt.get('label')
                text = opt.get('text')
            except Exception:
                # if opt is not a dict, skip it
                continue
            is_true = label in correct_answers
            mapped_options.append({'label': label, 'text': text, 'is_true': is_true})
        normalized['options'] = mapped_options

        # sub_categories - frontend may send subCategoryIds or subCategoryIds as numbers
        sc = data.get('subCategoryIds') or data.get('sub_categories') or data.get('subCategoryIds') or data.get('sub_category_ids')
        if sc is None:
            # allow empty to be handled by serializer
            normalized['sub_categories'] = []
        else:
            # ensure strings
            try:
                normalized['sub_categories'] = [str(x) for x in sc]
            except Exception:
                normalized['sub_categories'] = sc

        # image_unchanged default
        normalized['image_unchanged'] = data.get('image_unchanged', True)

        return normalized

    def create(self, request, *args, **kwargs):
        # Normalize incoming payload so frontend and backend field names align.
        normalized = self._normalize_request_data(request.data)
        serializer = self.get_serializer(data=normalized)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # For api/questions/hierarchy/
    @action(detail=False,methods=['get'],url_path='hierarchy',serializer_class=HierarchySerializer,permission_classes=[IsAuthenticated])
    def hierarchy(self, request):
        # definition under core/hierarchy
        hierarchy_data = get_heirarchy()
        serializer = self.get_serializer(hierarchy_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # For question selection
    # /api/questions/select/
    @action(detail=False, methods=['post'],url_path='select',serializer_class=QuestionSelectionSerializer,permission_classes=[IsAuthenticated],parser_classes=[JSONParser])
    def select(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category_ids = request.data.get('category_ids', [])
        sub_category_ids = request.data.get('sub_category_ids', [])
        queryset = get_questions_by_selection(category_ids, sub_category_ids)
        if not queryset:
            raise NotFound("No questions found for selected categories")
        response_data = QuestionSerializer(queryset, many=True)
        return Response(response_data.data, status=status.HTTP_200_OK)