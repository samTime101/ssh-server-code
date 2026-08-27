import contextvars

_current_tenant_subdomain = contextvars.ContextVar('tenant_subdomain', default=None)
_current_tenant_db = contextvars.ContextVar('tenant_db', default='default')
_current_tenant_mongo_db = contextvars.ContextVar('tenant_mongo_db', default='default')

def set_tenant_context(subdomain, db_alias, mongo_alias):
    _current_tenant_subdomain.set(subdomain)
    _current_tenant_db.set(db_alias)
    _current_tenant_mongo_db.set(mongo_alias)

def get_tenant_db():
    return _current_tenant_db.get()

def get_tenant_mongo_db():
    return _current_tenant_mongo_db.get()

def get_tenant_subdomain():
    return _current_tenant_subdomain.get()

def clear_tenant_context():
    _current_tenant_subdomain.set(None)
    _current_tenant_db.set('default')
    _current_tenant_mongo_db.set('default')
