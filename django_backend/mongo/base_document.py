from mongoengine import Document
from mongoengine.connection import get_db
from core.tenant_context import get_tenant_mongo_db

class TenantDocument(Document):
    meta = {'abstract': True}

    @classmethod
    def _get_db(cls):
        alias = get_tenant_mongo_db()
        from mongoengine.connection import _connection_settings
        if alias != 'default' and alias not in _connection_settings:
            try:
                # Resolve client database dynamically from its ID
                client_id = int(alias.split('_')[1])
                from sql.models import Client
                client = Client.objects.using('default').get(id=client_id)
                
                import os
                from mongoengine import register_connection
                from urllib.parse import urlparse, urlunparse
                
                mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/sisani_refactored")
                parsed_uri = urlparse(mongo_uri)
                clean_mongo_uri = urlunparse((parsed_uri.scheme, parsed_uri.netloc, '', '', '', ''))
                
                register_connection(
                    alias=alias,
                    name=client.mongo_database_name,
                    host=clean_mongo_uri
                )
            except Exception:
                pass
        return get_db(alias)

    @classmethod
    def _get_collection(cls):
        db = cls._get_db()
        collection_name = cls._meta.get('collection') or cls.__name__.lower()
        return db[collection_name]
