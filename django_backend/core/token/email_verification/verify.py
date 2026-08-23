from django.core.cache import cache
from sql.models import User

def verify_email_token(token):
    user_id = cache.get(f"email_verify:{token}")

    if not user_id:
        return "EMAIL_VERIFICATION_INVALID_TOKEN"

    from django.db import connections
    from core.tenant_context import get_tenant_db
    active_db = get_tenant_db()
    print(f"DEBUG: verify_email_token token={token} user_id={user_id} active_db={active_db}")

    try:
        user = User.objects.using(active_db).get(id=user_id)
        print(f"DEBUG: Found user {user.email} in active_db={active_db}")
    except User.DoesNotExist:
        print(f"DEBUG: User ID {user_id} NOT found in active_db={active_db}")
        for alias in list(connections.databases.keys()):
            try:
                u = User.objects.using(alias).get(id=user_id)
                print(f"DEBUG: Found user {u.email} in database alias={alias} (DB NAME={connections.databases[alias].get('NAME')})")
            except Exception:
                pass
        raise

    if user.is_email_verified:
        return "EMAIL_ALREADY_VERIFIED"

    user.is_email_verified = True
    user.save(update_fields=["is_email_verified"])
    return "EMAIL_VERIFICATION_SUCCESS"
