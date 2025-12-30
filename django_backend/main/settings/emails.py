import os
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = "Sisani Tech <sisani.tech@gmail.com>"

# AAILE LAI CHAI BACKEND LAI URL MA SET GAREKO XA, FRONTEND MA SET CHANGE (TODO)
EMAIL_VERIFICATION_URL = os.getenv("EMAIL_VERIFICATION_URL", "http://localhost:8000/verify-email/")
EMAIL_TIMEOUT = 20