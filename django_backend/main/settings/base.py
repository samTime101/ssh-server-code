from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")
ENVIRONMENT = os.getenv("DJANGO_ENV", "development")
# Google OAuth
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
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
    'drf_recaptcha',
    'django_filters',
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
    'api.sets',
    'api.constraint',
    'api.feedback',
    'api.notes',
    'api.analytics',
    'api.subscription',
    'api.testimonials',
    'api.reactions',
    'api.client'
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'core.middleware.tenant.TenantMiddleware',
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
DATABASE_ROUTERS = ['core.db_router.TenantRouter']

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
MEDIA_URL = "/media/"
MEDIA_ROOT = os.getenv("MEDIA_ROOT", str(BASE_DIR / "media"))
