from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_client_setup_email(client):
    subject = "Set up your Client Admin Account"
    setup_link = f"{settings.EMAIL_VERIFICATION_URL.replace('/verify-email/', '/client-setup/')}?token={client.setup_token}"

    message = f"""
Hi {client.organization_name},

Please use the following link to set up your admin account:
{setup_link}

Thank you!
Sisani Tech
"""

    html_content = f"""
<html>
  <body>
    <p>Hi {client.organization_name},</p>
    <p>Please use the following link to set up your admin account:</p>
    <p>
      <a href="{setup_link}" 
         style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
        Set up Admin Account
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
        [client.email],
    )

    email.attach_alternative(html_content, "text/html")
    email.send()
