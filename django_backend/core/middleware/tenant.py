import logging
from django.utils.deprecation import MiddlewareMixin
from django.db import connections
from django.http import Http404
from mongoengine import register_connection
from mongoengine.connection import _connection_settings
from sql.models import Client
from core.tenant_context import set_tenant_context, clear_tenant_context

logger = logging.getLogger(__name__)

class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        host = request.get_host().split(':')[0]        
        if host in ['localhost', '127.0.0.1', 'vaidix.org']:
            clear_tenant_context()
            return None
        subdomain = host.split('.')[0]
        
        try:
            client = Client.objects.using('default').get(subdomain=subdomain, status='ACTIVE')
        except Client.DoesNotExist:
            logger.warning(f"Tenant mapping not found for subdomain: {subdomain}")
            raise Http404("Tenant does not exist.")

        db_alias = f"tenant_{client.id}"        
        if db_alias not in connections:
            default_conf = connections.databases['default']
            db_config = default_conf.copy()
            db_config['NAME'] = client.database_name
            connections.databases[db_alias] = db_config
        mongo_alias = f"mongo_{client.id}"
        if mongo_alias not in _connection_settings:
            import os
            mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/sisani_refactored")
            from urllib.parse import urlparse, urlunparse
            parsed_uri = urlparse(mongo_uri)
            clean_mongo_uri = urlunparse((parsed_uri.scheme, parsed_uri.netloc, '', '', '', ''))
            register_connection(
                alias=mongo_alias,
                name=client.mongo_database_name,
                host=clean_mongo_uri
            )
        set_tenant_context(subdomain, db_alias, mongo_alias)
        request.tenant = client

    def process_response(self, request, response):
        clear_tenant_context()
        return response
