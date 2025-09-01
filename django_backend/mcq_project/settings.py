
from pathlib import Path
from datetime import timedelta


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
    'rest_framework', 
    "rest_framework.authtoken",
    'dj_rest_auth', 
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
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',  
    ],
}
CORS_ORIGIN_ALLOW_ALL = True 
# -----------------------------------------------------------

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
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
    'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'sisani',
            'USER': 'samip@localhost',
            'PASSWORD': 'samip@admin',
            'HOST': 'localhost',  # e.g., 'localhost' or an IP address
            'PORT': '3306',  # Default MySQL port
        }
}
# ---------------------ADDED BY SAMIP REGMI-------------------
AUTH_USER_MODEL = 'sqldb_app.User'
# ------------------------------------------------------------

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


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "mcq_project_cookie",
    "JWT_AUTH_REFRESH_COOKIE": "mcq_project_refresh_cookie",
}


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

