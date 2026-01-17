# SEND GERERATED EMAIL VERIFICATION LINK TO USER EMAIL
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
# AAILE KO LAGI CHAI BACKEND MAI SET GAREKO XA

def send_verification_email(user, token):
    subject = "Verify your email address"
    verification_link = f"{settings.EMAIL_VERIFICATION_URL}{token}"

    message = f"""
Hi {user.first_name},

Please verify your email address by clicking the link below:
{verification_link}

Thank you!
Sisani Tech
"""

    html_content = f"""
<html>
  <body>
    <p>Hi {user.first_name},</p>
    <p>Please verify your email address by clicking the link below:</p>
    <p>
      <a href="{verification_link}" 
         style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
        Verify Email
      </a>
    </p>
    <p>Thank you!<br><strong>Sisani Tech</strong></p>
  </body>
</html>
"""

    email = EmailMultiAlternatives(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )

    email.attach_alternative(html_content, "text/html")
    email.send()
