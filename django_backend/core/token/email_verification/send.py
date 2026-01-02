# SEND GERERATED EMAIL VERIFICATION LINK TO USER EMAIL
from django.core.mail import send_mail
from django.conf import settings
# AAILE KO LAGI CHAI BACKEND MAI SET GAREKO XA

def send_verification_email(user, token):
    subject = "Verify your email address"
    message = (
        f"Hi {user.first_name},\n\n"
        f"Please verify your email address by clicking the link below:\n"
        f"{settings.EMAIL_VERIFICATION_URL}{token}\n\n"
        f"Thank you!\n"
        f"Sisani Tech"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
