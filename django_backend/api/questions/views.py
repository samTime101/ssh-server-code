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
from core.selection.selection import get_questions_by_selection
from core.pagination import StandardResultsSetPagination,QuestionResultsSetPagination
# from rest_framework.permissions import IsAdminUser, IsAuthenticated
from core.permissions.permissions import IsAdminUser, IsAuthenticated
from rest_framework.parsers import JSONParser
from core.parser import QuestionMultipartJsonParser
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.exceptions import NotFound
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from bson import ObjectId


@extend_schema_view(
    create=extend_schema(exclude=True),
    update=extend_schema(exclude=True),
    partial_update=extend_schema(exclude=True),
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name="search",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Search in question_text and explanation"
            ),
            OpenApiParameter(
                name="category_id",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Filter by category ObjectId"
            ),
            OpenApiParameter(
                name="sub_category_id",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Filter by sub-category ObjectId"
            ),
        ]
    )
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
    # both admin and contributor can access
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = Question.objects.all()

        search = self.request.query_params.get("search")
        category_id = self.request.query_params.get("category_id")
        sub_category_id = self.request.query_params.get("sub_category_id")

        if search:
            queryset = queryset.filter(
                __raw__={
                    "$or": [
                        {"question_text": {"$regex": search, "$options": "i"}},
                        {"explanation": {"$regex": search, "$options": "i"}},
                    ]
                }
            )

        if category_id:
            queryset = queryset.filter(category_id=ObjectId(category_id))

        if sub_category_id:
            queryset = queryset.filter(sub_category_id=ObjectId(sub_category_id))

        return queryset

    # For api/questions/hierarchy/
    @action(detail=False,methods=['get'],url_path='hierarchy',serializer_class=HierarchySerializer,permission_classes=[IsAuthenticated])
    def hierarchy(self, request):
        # definition under core/hierarchy
        user_guid = getattr(request.user, "user_guid", None)
        hierarchy_data = get_heirarchy(user_guid=user_guid)
        serializer = self.get_serializer(hierarchy_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # For question selection
    # /api/questions/select/
    @extend_schema(request=QuestionSelectionSerializer, responses=QuestionPublicSerializer(many=True), parameters=[WrongOnlyQuerySerializer, NonAttemptedQuerySerializer ])
    @action(detail=False, methods=['post'],url_path='select',serializer_class=QuestionSelectionSerializer,permission_classes=[IsAuthenticated],parser_classes=[JSONParser],pagination_class=QuestionResultsSetPagination)
    def select(self, request):
        query_serializer = WrongOnlyQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)
        wrong_only = query_serializer.validated_data.get('wrong_only', False)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category_ids = request.data.get('category_ids', [])
        sub_category_ids = request.data.get('sub_category_ids', [])

        # query param, wrong_only = true/false, default false
        wrong_only = request.query_params.get('wrong_only', 'false').lower() == "true"
        not_attempted = request.query_params.get('non_attempted', 'true').lower() == "true"

         # definition under core/selection/selection.py
        user_guid = getattr(request.user, "user_guid")

        # cant get both wrong_only and non_attempted true at the same time
        # Kina vaney suppose "What is 2+2?" question was answered wrong by user
        # if wrong_only = true, it will return that question
        # if non_attempted = true, it will NOT return that question
        # logically conflict hunxa
        if wrong_only and not_attempted:
            raise NotFound("Cannot filter both wrong_only and non_attempted questions at the same time.")

        queryset = get_questions_by_selection(category_ids, sub_category_ids, wrong_only=wrong_only, user_guid=user_guid, non_attempted=not_attempted)
        if not queryset:
            raise NotFound("No questions found for requested criteria.")
        page = self.paginate_queryset(queryset)
        serializer = QuestionPublicSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)
        # response_data = QuestionPublicSerializer(queryset, many=True)
        # return Response(response_data.data, status=status.HTTP_200_OK)        