# STRICT ADMIN ONLY ENDPOINT
# SAMIP REGMI AUG 21
from rest_framework import viewsets, status
from core.pagination import StandardResultsSetPagination
from core.permissions.permissions import IsAdminUser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from sql.models import Client, ClientUser
from .serializers import ClientSerializer, ClientAdminSetupSerializer
from core.token.client_setup.send import send_client_setup_email
from rest_framework.views import APIView

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by("-created_at")
    serializer_class = ClientSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ["get", "post", "put", "patch", "delete"]
    lookup_field = "id"
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        client = serializer.save()
        try:
            send_client_setup_email(client)
        except Exception as e:
            print("Failed to send email:", e)


class ClientAdminSetupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = Client.objects.get(setup_token=token, is_setup_completed=False)
        except Client.DoesNotExist:
            return Response({"error": "Invalid or expired setup token"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ClientAdminSetupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()        
            ClientUser.objects.create(user=user, client=client)
            from sql.models import Role, UserRole
            role, _ = Role.objects.get_or_create(name='CLIENT_ADMIN')
            UserRole.objects.create(user=user, role=role)        
            client.is_setup_completed = True
            client.save()
            
            return Response({"message": "Admin account created successfully.", "user_id": user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)