
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()  

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-yg$-iov^lsz7mv^6-oy)11!4^*mzr$!w#bb-y2jfpcs$n8)pxy'
DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # ----------------_ADDED BY SAMIP REGMI-------------------
    'corsheaders', 
    'rest_framework.authtoken', 
    'drf_spectacular', 
    'dj_rest_auth',
    # --------------------------------------- 
    'signup_app',
    'signin_app',
    'user_data', #  
    'sqldb_app', 
    'mongodb_app',
    'create_category',
    'create_subcategory',
    'create_subsubcategory',
    'create_question',
    'get_categories',
    'select_questions',
    'user_attempts',
    'userhistory_app',
    # -------------------------------------------------------
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ADDED BY SAMIP REGMI
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -------------------_ADDED BY SAMIP REGMI-------------------

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication", # JWT AUTHENTICATION
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',  # FOR API DOCS
}
CORS_ORIGIN_ALLOW_ALL = True 

ROOT_URLCONF = 'mcq_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mcq_project.wsgi.application'

DATABASES = {
    'default': {
            'ENGINE': os.getenv("ENGINE"),
            'NAME': os.getenv("NAME"),
            'USER': os.getenv("DB_USER"),
            'PASSWORD': os.getenv("DB_PASSWORD"),
            'HOST': os.getenv("HOST"),
            'PORT': os.getenv("PORT"),
        }
}
AUTH_USER_MODEL = 'sqldb_app.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



# REFERENCE https://pypi.org/project/djangorestframework-simplejwt/3.2/
# ADDED FROM SETTINGS SECTION
# ADDED BY SAMIP REGMI
# FOR TESTING PURPOSES FROM POSTMAN BECAUSE JWT TOKEN WAS BEING EXPIRED
# IN VERY SHORT TIME
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=12),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
}



# SERVER LOGS
# https://docs.djangoproject.com/en/5.2/howto/logging/

# FULLY REFRENCED FROM DOCS FILE 

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "server.log",
            "level": "DEBUG",
        },
        "console": {  
            "class": "logging.StreamHandler",
            "level": "DEBUG",
        },
    },
    "loggers": {
        "django.server": { 
            "level": "DEBUG",
            "handlers": ["file", "console"],
        },
    },
}

