from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")
ENVIRONMENT = os.getenv("DJANGO_ENV", "development")
DEBUG = ENVIRONMENT != "production"
ALLOWED_HOSTS = ["*"] if DEBUG else os.getenv("ALLOWED_HOSTS","").split(",")


DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
THIRD_PARTY_APPS = [
    'drf_spectacular',
    'rest_framework',
    'rest_framework_mongoengine',
    'corsheaders',
    'rest_framework_simplejwt',
]

# https://stackoverflow.com/a/71172233
LOCAL_APPS = [
    'sql',
    'mongo',
    'api.authentication',
    'api.questions',
    'api.classifications',
    'api.users',
    'api.colleges',
    'api.roles',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'main.urls'
WSGI_APPLICATION = 'main.wsgi.application'

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'sql.User'

if ENVIRONMENT == "production":
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
else:
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOWED_ORIGINS = []

print(f'ALLOWED HOSTS       : {ALLOWED_HOSTS}')
print(f'CORS ALLOWED ORIGINS: {CORS_ALLOW_ALL_ORIGINS}')
print(f'DJANGO ENVIRONMENT  : {ENVIRONMENT}')


INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS