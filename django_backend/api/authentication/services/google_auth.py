import logging

import requests
from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework.exceptions import AuthenticationFailed

logger = logging.getLogger(__name__)


def exchange_code_for_token(code: str):
    client_id = settings.GOOGLE_CLIENT_ID
    client_secret = settings.GOOGLE_CLIENT_SECRET
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    print(f"Client ID: {client_id}, Client Secret: {client_secret}, Redirect URI: {redirect_uri}")
    payload = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }

    google_auth_api_url = "https://oauth2.googleapis.com/token"
    try:
        response = requests.post(
            google_auth_api_url,
            data=payload,
            timeout=10,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        response_text = getattr(getattr(e, "response", None), "text", None)
        logger.exception(
            "Google token exchange failed: %s",
            response_text or e,
        )
        raise AuthenticationFailed("Unable to authenticate with Google") from e


def verify_google_id_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

        return idinfo

    except ValueError as e:
        logger.exception("Google token verification failed: %s", e)
        raise AuthenticationFailed("Invalid Google token") from e