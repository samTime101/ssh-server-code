import uuid
from django.core.cache import cache

# 30 minutes default ma
EXPIRY_TIME = 30 * 60 

def create_password_reset_token(user_id):
    cache.delete(f"user_password_reset:{user_id}")
    token = str(uuid.uuid4())
    cache.set(f"password_reset:{token}", user_id, EXPIRY_TIME)
    cache.set(f"user_password_reset:{user_id}", token, EXPIRY_TIME)
    return token
