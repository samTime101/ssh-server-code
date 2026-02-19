from django.core.cache import cache
from sql.models import User

def verify_email_token(token):
    user_id = cache.get(f"email_verify:{token}")

    if not user_id:
        return "EMAIL_VERIFICATION_INVALID_TOKEN"

    user = User.objects.get(id=user_id)

    if user.is_email_verified:
        return "EMAIL_ALREADY_VERIFIED"

    user.is_email_verified = True
    user.save(update_fields=["is_email_verified"])
    return "EMAIL_VERIFICATION_SUCCESS"
