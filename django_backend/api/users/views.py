from datetime import datetime
from sql.models import User, Role, UserRole
from rest_framework.viewsets import ModelViewSet
# from rest_framework.permissions import IsAuthenticated, IsAdminUser
from core.permissions.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from core.pagination import StandardResultsSetPagination
from mongo.models import Attempt, Submissions
from drf_spectacular.utils import extend_schema 
from rest_framework.exceptions import MethodNotAllowed, NotFound
from rest_framework.decorators import action

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
        role_ids = request.data.get('role_ids', [])
        serializer = AssignRoleSerializer(data={'role_ids': role_ids})
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(user_guid=user_guid)
        except User.DoesNotExist:
            return NotFound("User not found")
        assigned_roles = []
        for role_id in serializer.validated_data['role_ids']:
            role = Role.objects.get(id=role_id)
            user_role, created = UserRole.objects.get_or_create(user=user, role=role)
            assigned_roles.append(user_role)
        response_serializer = UserRoleSerializer(assigned_roles, many=True)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    # api users/<>/remove-role/
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser], url_path='remove-role', serializer_class=RemoveRoleSerializer)
    def remove_role(self, request, *args, **kwargs):
        user_guid = kwargs.get('user_guid')
        role_ids = request.data.get('role_ids', [])
        serializer = RemoveRoleSerializer(data={'role_ids': role_ids})
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(user_guid=user_guid)
        except User.DoesNotExist:
            return NotFound("User not found")
        for role_id in serializer.validated_data['role_ids']:
            role = Role.objects.get(id=role_id)
            UserRole.objects.filter(user=user, role=role).delete()
        return Response({"detail": "Roles removed successfully"}, status=status.HTTP_200_OK)

class SubmissionCollectionViewSet(ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["post","get"]

    def get_queryset(self):
        user_guid = getattr(self.request.user, "user_guid", None)
        return Submissions.objects(user_guid=user_guid) if user_guid else Submissions.objects.none()

    # submissions/<> not allowed for now
    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        raise MethodNotAllowed("Method 'retrieve' not allowed.")
    
    # submissions/<user_guid>
    def list(self, request, *args, **kwargs):
        user_guid = getattr(request.user, "user_guid", None)
        collection = Submissions.objects(user_guid=user_guid).first()
        if not collection:
            raise NotFound("No submission collection found for the user.")
        serializer = self.get_serializer(collection)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=AttemptSerializer,responses=SubmissionResponseSerializer)
    def create(self, request, *args, **kwargs):
        user_guid = getattr(request.user, "user_guid", None)
        serializer = AttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_attempt = serializer.validated_data
        attempt_doc = Attempt(**validated_attempt)

        # previous implementation for backup if the below one fails
        # https://github.com/sisani9/sisani-eps/commit/8cde3f499ca223ff2e81a27d619645d619610936#diff-b1c10dba86a71748c7df2c1f941f80313fb6792e0e6ee92e31ba7da26e23142f
        

        # In new implementation, one question can have only one attempt per user, if attempt exists, 
        # remove any existing attempt for the question
        Submissions.objects(user_guid=user_guid).update_one(pull__attempts__question=attempt_doc.question.id)

        # @see: https://github.com/samTime101/sisani-eps-samip/blob/e92a536bb1fd961b4fa0f6fa563ca1febd10077a/django_backend/api/users/views.py
        # if submission exists for user with requested guid
        # update the attempt
        # else append to it
        Submissions.objects(user_guid=user_guid).update_one(add_to_set__attempts=attempt_doc,set__started_at=datetime.utcnow(),upsert=True)
        response_data = SubmissionResponseSerializer(attempt_doc)
        return Response(response_data.data, status=status.HTTP_201_CREATED)