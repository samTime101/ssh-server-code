from datetime import datetime
from sql.models import User, Role, UserRole
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, SubmissionsSerializer, SubmissionResponseSerializer, AttemptSerializer, RoleSerializer, UserRoleSerializer
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
    http_method_names = ['get', 'put', 'delete', 'patch']
    lookup_field = 'user_guid'

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='profile')
    def profile(self, request, *args, **kwargs):
        user_guid = getattr(request.user, "user_guid", None)
        try:
            user = User.objects.get(user_guid=user_guid)
        except User.DoesNotExist:
            return NotFound("User not found")
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


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

        # if submission exists for user with requested guid
        # update the attempt
        # else append to it
        # try to find an existing submission with an attempt for the same question
        question = validated_attempt.get('question')
        # if a submission exists and has an attempt for this question, update that embedded attempt
        existing_match = Submissions.objects(user_guid=user_guid, attempts__question=question).first()

        if existing_match:
            # update the matched embedded attempt fields using a raw pymongo update
            Submissions._get_collection().update_one(
                {"_id": existing_match.id, "attempts.question": question.id},
                {
                    "$set": {
                        "attempts.$.selected_answers": validated_attempt.get("selected_answers", []),
                        "attempts.$.is_correct": validated_attempt.get("is_correct", False),
                        "attempts.$.attempted_at": datetime.utcnow(),
                        "started_at": datetime.utcnow(),
                    }
                },
            )
            # fetch the updated attempt to return
            submission_doc = Submissions.objects(user_guid=user_guid).first()
            updated_attempt = None
            for a in submission_doc.attempts:
                try:
                    if a.question.id == question.id:
                        updated_attempt = a
                        break
                except Exception:
                    continue
            response_data = SubmissionResponseSerializer(updated_attempt)
            return Response(response_data.data, status=status.HTTP_200_OK)
        else:
            # no existing attempt for this question — append as before
            Submissions.objects(user_guid=user_guid).update_one(add_to_set__attempts=attempt_doc, set__started_at=datetime.utcnow(), upsert=True)
            response_data = SubmissionResponseSerializer(attempt_doc)
            return Response(response_data.data, status=status.HTTP_201_CREATED)

class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get', 'post']

class UserRoleViewSet(ModelViewSet):
    """ViewSet for managing user role assignments."""
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get', 'post', 'delete']
    
    def get_queryset(self):
        """Filter user roles by user_id if provided in query params."""
        queryset = UserRole.objects.all()
        user_id = self.request.query_params.get('user_guid')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset