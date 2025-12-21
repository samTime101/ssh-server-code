from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('api/', include('api.authentication.urls')),
    path('api/', include('api.classifications.urls')),
    path('api/', include('api.questions.urls')),
    path('api/', include('api.users.urls')),
    path('api/', include('api.colleges.urls')),
    path('api/', include('api.roles.urls')),
    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
