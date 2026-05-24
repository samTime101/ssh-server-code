# SEND GERERATED EMAIL VERIFICATION LINK TO USER EMAIL
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
# AAILE KO LAGI CHAI BACKEND MAI SET GAREKO XA

def send_password_reset_email(user, token):
    subject = "Password Reset Link"
    verification_link = f"{settings.PASSWORD_RESET_URL}{token}"

    message = f"""
Hi {user.first_name},

Please reset your password by clicking the link below:
{verification_link}

Thank you!
Sisani Tech
"""

    html_content = f"""
<html>
  <body>
    <p>Hi {user.first_name},</p>
    <p>Please reset your password by clicking the link below:</p>
    <p>
      <a href="{verification_link}" 
         style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
        Reset Password
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
