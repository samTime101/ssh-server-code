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


def send_tenant_admin_invite_email(email_address, token, subdomain, first_name="Administrator"):
    subject = "Setup your Vaidix Organization Administrator Account"
    from urllib.parse import urlparse
    url = settings.EMAIL_VERIFICATION_URL
    parsed_url = urlparse(url)
    new_netloc = f"{subdomain}.{parsed_url.netloc}"
    
    # Construct link pointing to the /setup-admin/ route on the frontend
    base_url = f"{parsed_url.scheme}://{new_netloc}"
    setup_link = f"{base_url}/setup-admin/{token}/"

    message = f"""
Hi {first_name},

Your organization has been registered on Vaidix.
Please setup and verify your administrator account by clicking the link below:
{setup_link}

Thank you!
Vaidix Team
"""

    html_content = f"""
<html>
  <body>
    <p>Hi {first_name},</p>
    <p>Your organization has been registered on Vaidix.</p>
    <p>Please setup and verify your administrator account by clicking the link below:</p>
    <p>
      <a href="{setup_link}" 
         style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
        Setup Admin Account
      </a>
    </p>
    <p>Thank you!<br><strong>Vaidix Team</strong></p>
  </body>
</html>
"""

    email = EmailMultiAlternatives(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email_address],
    )

    email.attach_alternative(html_content, "text/html")
    email.send()
