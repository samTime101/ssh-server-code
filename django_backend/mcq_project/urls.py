from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,  TokenRefreshView,)
from drf_spectacular.views import (SpectacularAPIView, SpectacularSwaggerView,)

# ---------------_ADDED BY SAMIP REGMI---------------
from signup_app.views import SignUpView
from signin_app.views import SignInView
from user_data.views import UserDataView
from create_category.views import CreateCategoryView
from create_subcategory.views import CreateSubCategoryView
from create_subsubcategory.views import CreateSubSubCategoryView
from get_categories.views import GetCategoriesView
from create_question.views import CreateQuestionView
from select_questions.views import SelectQuestionView
from user_attempts.views import UserAttemptView
from userhistory_app.views import UserAttemptHistory
# -----------------------------------------------------

urlpatterns = [

    path('admin/', admin.site.urls),

    # ------------__ADDED BY SAMIP REGMI---------------

    path('api/signup/',SignUpView.as_view(), name='signup'),
    path('api/signin/', SignInView.as_view(), name='signin'),

    path('api/user/', UserDataView.as_view(),name='user_data'),
    path('api/get/categories/', GetCategoriesView.as_view(), name='get_categories'),
    path('api/select/questions/',SelectQuestionView.as_view(),name='select_questions'),

    path('api/create/category/',CreateCategoryView.as_view(),name='create_category'),
    path('api/create/subcategory/',CreateSubCategoryView.as_view(),name='create_subcategory'),
    path('api/create/subsubcategory/',CreateSubSubCategoryView.as_view(),name='create_subsubcategory'),
    path('api/create/question/',CreateQuestionView.as_view(),name='create_question'),


    path('api/user/attempt/', UserAttemptView.as_view(), name='user_attempt'),
    path('api/user/attempt/history/', UserAttemptHistory.as_view(), name='user_attempt'),


    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API DOCS
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # ------------------------------------------------------
]

# USER ANALYTICS GET GARDA
# api/user/analytics
"""
response_type = {
        
}
"""
