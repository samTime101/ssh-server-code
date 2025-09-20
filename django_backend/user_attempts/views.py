from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from .serializers import UserAttemptSerializer
from drf_spectacular.utils import extend_schema
from utils.responses.attempts_response import build_userattempt_response

class UserAttemptView(APIView):
    permission_classes = [IsAuthenticated]
    @extend_schema(request=UserAttemptSerializer)
    def post(self, request: Request) -> Response:

        serializer = UserAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt = serializer.create(serializer.validated_data)

        return build_userattempt_response()
