from datetime import datetime
from sql.models import User, Role, UserRole
from rest_framework.viewsets import ModelViewSet
# from rest_framework.permissions import IsAuthenticated, IsAdminUser
from core.permissions.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from core.pagination import StandardResultsSetPagination
from core.constants.status import IN_PROGRESS_STATUS, SUBMITTED_STATUS
from mongo.models import Attempt, Submissions, Bookmarks
from drf_spectacular.utils import extend_schema, extend_schema_view 
from rest_framework.exceptions import MethodNotAllowed, NotFound
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAdminUser]
    http_method_names = ['post','get', 'put', 'delete', 'patch']
    lookup_field = 'user_guid'

    # BLOCK POST FOR USER CREATION FROM HERE
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("Method 'create' not allowed. Use /api/auth/register/ to create users.")

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='profile')
    def profile(self, request, *args, **kwargs):
        user_guid = getattr(request.user, "user_guid", None)
        try:
            user = User.objects.get(user_guid=user_guid)
        except User.DoesNotExist:
            return NotFound("User not found")
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='bookmarks')
    def bookmarks(self, request):
        user_guid = getattr(request.user, "user_guid")
        paginator = StandardResultsSetPagination()
        bookmarks_collection = Bookmarks.objects(user_guid=user_guid).first()
        bookmarks_list = bookmarks_collection.bookmark if bookmarks_collection else []
        paginated_bookmarks = paginator.paginate_queryset(bookmarks_list, request)
        serializer = BookmarkSerializer(paginated_bookmarks, many=True)
        return paginator.get_paginated_response(serializer.data)
        
    # /api/users/<>/roles/
    @action(detail=True, methods=['get'], permission_classes=[IsAdminUser], url_path='roles')
    def roles(self, request, *args, **kwargs):
        user_guid = kwargs.get('user_guid')
        try:
            user = User.objects.get(user_guid=user_guid)
        except User.DoesNotExist:
            return NotFound("User not found")
        # user_roles = UserRole.objects.filter(user=user)
        user_roles = user.get_roles()
        # serializer = UserRoleSerializer(user_roles, many=True)
        return Response(user_roles, status=status.HTTP_200_OK)
    
    # /api/users/roles/
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser], url_path='roles')
    def all_roles(self, request, *args, **kwargs):
        user_roles = UserRole.objects.all()
        serializer = UserRoleSerializer(user_roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    # api/users/<>/assign-role/
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser], url_path='assign-role', serializer_class=AssignRoleSerializer)
    def assign_role(self, request, *args, **kwargs):
        user_guid = kwargs.get('user_guid')
        try:
            user = User.objects.get(user_guid=user_guid)
        except User.DoesNotExist:
            raise NotFound("User not found")
        serializer = self.get_serializer(data=request.data,context={"user": user})
        serializer.is_valid(raise_exception=True)
        if user == request.user:
            raise ValidationError("You cannot assign roles to yourself.")
        assigned_roles = []
        # for role_id in serializer.validated_data['role_ids']:
        #     role = Role.objects.get(id=role_id)
        #     user_role = UserRole.objects.create(user=user, role=role)
        #     assigned_roles.append(user_role)
        roles =  Role.objects.filter(id__in=serializer.validated_data['role_ids'])
        for role in roles:
            user_role = UserRole.objects.create(user=user, role=role)
            assigned_roles.append(user_role)
        response_serializer = UserRoleSerializer(assigned_roles, many=True)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    # api users/<>/remove-role/
    @action(detail=True, methods=['delete'], permission_classes=[IsAdminUser], url_path='remove-role', serializer_class=RemoveRoleSerializer)
    def remove_role(self, request, *args, **kwargs):
        user_guid = kwargs.get('user_guid')
        try:
            user = User.objects.get(user_guid=user_guid)
        except User.DoesNotExist:
            raise NotFound("User not found")
        serializer = self.get_serializer(data=request.data,context={"user": user})
        serializer.is_valid(raise_exception=True)
        if user == request.user:
            raise ValidationError("You cannot remove your own roles.")
        # for role_id in serializer.validated_data['role_ids']:
        #     role = Role.objects.get(id=role_id)
        #     UserRole.objects.filter(user=user, role=role).delete()
        roles =  Role.objects.filter(id__in=serializer.validated_data['role_ids'])
        for role in roles:
            UserRole.objects.filter(user=user, role=role).delete()
        return Response({"detail": "Roles removed successfully"}, status=status.HTTP_200_OK)

@extend_schema_view(create=extend_schema(exclude=True))
class SubmissionCollectionViewSet(ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["post","get"]
    lookup_field = 'id'
    lookup_value_regex = '[0-9a-f]{24}'

    def get_object(self):
        submission_id = self.kwargs.get('id')
        user_guid = getattr(self.request.user, "user_guid", None)
        submission = Submissions.objects.filter(id=submission_id, user_guid=user_guid).first()
        if not submission:
            raise NotFound("Submission not found.")
        return submission

    # DISABLE POST /api/submissions/ FOR CREATING SUBMISSIONS, AS THEY SHOULD BE CREATED VIA /api/sets/<set_id>/ RETRIEVE ENDPOINT
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("Method 'create' not allowed")

    def get_queryset(self):
        user_guid = getattr(self.request.user, "user_guid", None)
        return Submissions.objects(user_guid=user_guid) if user_guid else Submissions.objects.none()
    
    # submissions/
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().order_by('-started_at')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # submissions/<submission_id>/
    def retrieve(self, request, *args, **kwargs):
        submission = self.get_object()
        serializer = self.get_serializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=AttemptSerializer, responses=SubmissionResponseSerializer)
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='attempts')
    def attempts(self, request, *args, **kwargs):
        submission = self.get_object()
        if submission.status != IN_PROGRESS_STATUS:
            raise ValidationError("Submission is not active.")

        serializer = AttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_attempt = serializer.validated_data
        attempt_doc = Attempt(**validated_attempt)

        allowed_question_ids = {str(question.id) for question in submission.selected_questions if question}
        if str(attempt_doc.question.id) not in allowed_question_ids:
            raise ValidationError("Question is not part of this submission.")

        Submissions.objects(id=submission.id).update_one(pull__attempts__question=attempt_doc.question.id)
        Submissions.objects(id=submission.id).update_one(add_to_set__attempts=attempt_doc)

        response_data = SubmissionResponseSerializer(attempt_doc).data
        response_data['submission_id'] = str(submission.id)
        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='submit', serializer_class=None)
    def submit(self, request, *args, **kwargs):
        submission = self.get_object()
        if submission.status != IN_PROGRESS_STATUS:
            raise ValidationError("Submission is not in progress.")
        submission.status = SUBMITTED_STATUS
        submission.submitted_at = datetime.utcnow()
        submission.save()
        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)
