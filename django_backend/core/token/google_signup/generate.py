from django.core import signing

GOOGLE_SIGNUP_PURPOSE = "google_signup"
GOOGLE_SIGNUP_SALT = "google_signup"
# Short-lived: 10 minutes
GOOGLE_SIGNUP_TOKEN_MAX_AGE = 10 * 60


def create_google_signup_token(*, email, google_sub, first_name, last_name):
    payload = {
        "purpose": GOOGLE_SIGNUP_PURPOSE,
        "email": email,
        "google_sub": google_sub,
        "first_name": first_name,
        "last_name": last_name,
    }
    return signing.dumps(payload, salt=GOOGLE_SIGNUP_SALT)
