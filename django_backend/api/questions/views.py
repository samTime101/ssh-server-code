# Nov 2
# Samip Regmi
# Views file
# Endpoint /api/question/<>

from rest_framework_mongoengine import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from api.questions.serializers.csv_upload import CSVUploadSerializer
from core.parser import QuestionCSVParser
from core.constants.status import APPROVED_STATUS, IN_PROGRESS_STATUS, PENDING_STATUS
from mongo.models import Question, Bookmark, Bookmarks, Submissions
from api.questions.serializers.question import *
from api.questions.serializers.hierarchy import *
from api.questions.serializers.selection import *
from api.questions.serializers.feedback import *
from core.heirarchy import get_heirarchy
from core.selection.selection import get_questions_by_selection
from core.pagination import StandardResultsSetPagination,QuestionResultsSetPagination
# from rest_framework.permissions import IsAdminUser, IsAuthenticated
from core.permissions.permissions import IsAdminUser, IsAuthenticated,AllowAny
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
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
        if self.action in ['create']:
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        base_queryset = Question.objects.all()            
        qs = filter_questions_queryset(base_queryset, self.request.query_params)
        qs = filter_status(qs,self.request)
        return qs

    def perform_create(self, serializer):
        # Non-admin users can only create questions with pending status
        if not self.request.user.has_role("ADMIN"):
            serializer.save(status=PENDING_STATUS)
        else:
            serializer.save()

    # for get/questions/<id>, allow from any authenticated user, not just admin
    # https://github.com/users/sisani9/projects/2/views/1?pane=issue&itemId=159302989&issue=sisani9%7Csisani-eps%7C147
    def retrieve(self, request, *args, **kwargs):
        qs = Question.objects(status=APPROVED_STATUS)
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
        if question.status != APPROVED_STATUS:
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

    # For CSV bulk upload
    # /api/questions/upload_csv/
    @action(
        detail=False, 
        methods=['post'], 
        url_path='upload_csv',
        serializer_class=CSVUploadSerializer,
        permission_classes=[IsAdminUser],
        parser_classes=[MultiPartParser, FormParser]
    )
    def upload_csv(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        csv_file = request.FILES.get('csv_file')
        if not csv_file:
            return Response(
                {"detail": "csv_file is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        parser = QuestionCSVParser()
        result = parser.parse_csv(csv_file)
        
        if result['errors'] and not result['created']:
            return Response(
                {
                    "detail": "Failed to upload questions",
                    "created": 0,
                    "errors": result['errors']
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            {
                "detail": f"Successfully created {result['created']} question(s)",
                "created": result['created'],
                "errors": result['errors'],
            },
            status=status.HTTP_201_CREATED if result['created'] > 0 else status.HTTP_200_OK
        )

    # For question selection
    # /api/questions/select/
    @extend_schema(request=QuestionSelectionSerializer, responses=QuestionPublicSerializer(many=True), parameters=[WrongOnlyQuerySerializer, NonAttemptedQuerySerializer ])
    @action(detail=False, methods=['post'],url_path='select',serializer_class=QuestionSelectionSerializer,permission_classes=[IsAuthenticated],parser_classes=[JSONParser],pagination_class=QuestionResultsSetPagination)
    def select(self, request):
        query_serializer = WrongOnlyQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)

        # query param, wrong_only = true/false, default false
        wrong_only = query_serializer.validated_data.get('wrong_only', False)
        not_attempted = request.query_params.get('non_attempted', 'true').lower() == "true"

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)      
        
        category_ids = serializer.validated_data.get('category_ids', [])
        sub_category_ids = serializer.validated_data.get('sub_category_ids', [])


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
        all_selected_questions = list(queryset)
        if not queryset:
            raise NotFound("No questions found for requested criteria.")
        
        page = self.paginate_queryset(queryset)
        selected_questions = list(page) if page is not None else all_selected_questions
        
        submission = Submissions(user_guid=user_guid,selected_questions=all_selected_questions,attempts=[],status=IN_PROGRESS_STATUS,type="question_bank")
        submission.save()
        self.paginator.submission_id = str(submission.id)
        serializer = QuestionPublicSerializer(selected_questions, many=True)
        return self.get_paginated_response(serializer.data)

class QuestionFeedbackViewSet(viewsets.ModelViewSet):
    queryset = QuestionFeedback.objects.order_by("-created_at")
    serializer_class = QuestionFeedbackSerializer
    pagination_class = StandardResultsSetPagination
    lookup_field = "id"
    lookup_value_regex = "[0-9a-f]{24}"
    http_method_names = ['get', 'post']

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        question = Question.objects(id=self.kwargs["question_id"]).first()
        if not question or question.status != APPROVED_STATUS:
            raise NotFound("Question not found.")
        serializer.save(question=question,user_guid=self.request.user.user_guid,)