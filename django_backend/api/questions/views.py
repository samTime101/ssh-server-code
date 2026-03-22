# Nov 2
# Samip Regmi
# Views file
# Endpoint /api/question/<>

from rest_framework_mongoengine import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from mongo.models import Question, Bookmark, Bookmarks
from api.questions.serializers.question import *
from api.questions.serializers.hierarchy import *
from api.questions.serializers.selection import *
from core.heirarchy import get_heirarchy
from core.selection.selection import get_questions_by_selection
from core.pagination import StandardResultsSetPagination,QuestionResultsSetPagination
# from rest_framework.permissions import IsAdminUser, IsAuthenticated
from core.permissions.permissions import IsAdminUser, IsAuthenticated,AllowAny
from rest_framework.parsers import JSONParser
from core.parser import QuestionMultipartJsonParser
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.exceptions import NotFound
from api.questions.serializers.question import QuestionFilterSerializer
from api.questions.filters import filter_questions_queryset
from core.filters.status import filter_status

@extend_schema_view(
    create=extend_schema(exclude=True),
    update=extend_schema(exclude=True),
    partial_update=extend_schema(exclude=True),
    list=extend_schema(parameters=[QuestionFilterSerializer])
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


    def get_permissions(self):
        if self.action == 'retrieve':
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        base_queryset = Question.objects.all()            
        qs = filter_questions_queryset(base_queryset, self.request.query_params)
        qs = filter_status(qs,self.request)
        return qs

    # for get/questions/<id>, allow from any authenticated user, not just admin
    # https://github.com/users/sisani9/projects/2/views/1?pane=issue&itemId=159302989&issue=sisani9%7Csisani-eps%7C147
    def retrieve(self, request, *args, **kwargs):
        qs = Question.objects(status="approved")
        instance = qs.filter(id=kwargs.get("id")).first()
        if not instance:
            raise NotFound("Question not found.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        
    # For api/questions/hierarchy/
    @action(detail=False,methods=['get'],url_path='hierarchy',serializer_class=HierarchySerializer,permission_classes=[IsAuthenticated])
    def hierarchy(self, request):
        # definition under core/hierarchy
        user_guid = getattr(request.user, "user_guid", None)
        hierarchy_data = get_heirarchy(user_guid=user_guid)
        serializer = self.get_serializer(hierarchy_data)
        return Response(serializer.data, status=status.HTTP_200_OK)    

    # For GET api/questions/<id>/bookmark/
    @action(detail=True, methods=['post'], url_path='bookmark', permission_classes=[IsAuthenticated], serializer_class=None)
    def bookmark(self, request, id=None):
        question = self.get_object()
        if question.status != "approved":
            raise NotFound("Question not found.")
        user_guid = getattr(request.user, "user_guid", None)
        existing_bookmark = Bookmarks.objects(user_guid=user_guid, bookmark__question=question.id).first()
        if existing_bookmark:
            return Response({"detail": "Question already bookmarked"}, status=status.HTTP_200_OK)
        bookmark = Bookmark(question=question)
        Bookmarks.objects(user_guid=user_guid).update_one(add_to_set__bookmark=bookmark, upsert=True)
        return Response({"detail": "Question bookmarked successfully"}, status=status.HTTP_200_OK)
    
    # for DELETE api/questions/<id>/bookmark/
    @bookmark.mapping.delete
    def remove_bookmark(self, request, id=None):
        question = self.get_object()
        user_guid = getattr(request.user, "user_guid", None)
        # check if bookmark exists before trying to remove
        existing_bookmark = Bookmarks.objects(user_guid=user_guid, bookmark__question=question.id).first()
        if not existing_bookmark:
            raise NotFound("Bookmark not found.")
        Bookmarks.objects(user_guid=user_guid).update_one(pull__bookmark__question=question.id)
        return Response({"detail": "Bookmark removed successfully"}, status=status.HTTP_200_OK)

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