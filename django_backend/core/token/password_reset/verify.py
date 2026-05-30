from django.core.cache import cache
from sql.models import User

def verify_password_reset_token(token):
    user_id = cache.get(f"password_reset:{token}")
    if not user_id:
        return {"status": "invalid"}
    return {
        "status": "success",
        "user_id": user_id
    }