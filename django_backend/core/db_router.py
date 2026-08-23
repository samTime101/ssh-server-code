from core.tenant_context import get_tenant_db

class TenantRouter:
    PLATFORM_MODELS = {'client'}

    def db_for_read(self, model, **hints):
        if model._meta.model_name in self.PLATFORM_MODELS:
            return 'default'
        return get_tenant_db()

    def db_for_write(self, model, **hints):
        if model._meta.model_name in self.PLATFORM_MODELS:
            return 'default'
        return get_tenant_db()

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations if they reside in the same database or if one of them is unsaved/unassigned
        if not obj1._state.db or not obj2._state.db:
            return True
        return obj1._state.db == obj2._state.db

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return True
