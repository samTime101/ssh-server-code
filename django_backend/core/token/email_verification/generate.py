import uuid
from django.core.cache import cache

# 30 minutes default ma
EXPIRY_TIME = 30 * 60 

def create_email_verification_token(user_id):
    cache.delete(f"user_email_verify:{user_id}")
    token = str(uuid.uuid4())
    cache.set(f"email_verify:{token}", user_id, EXPIRY_TIME)
    cache.set(f"user_email_verify:{user_id}", token, EXPIRY_TIME)
    return token
