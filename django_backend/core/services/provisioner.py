import re
import os
import logging
from django.db import connection, connections
from django.core.management import call_command
from django.apps import apps
from mongoengine import register_connection
from django.core.cache import cache
import secrets
from core.token.email_verification.send import send_tenant_admin_invite_email

logger = logging.getLogger(__name__)

def sanitize_name(name):
    return re.sub(r'[^a-zA-Z0-9_]', '', name)

def provision_tenant_databases(client, custom_sql_db=None, custom_mongo_db=None):
    client.status = 'PROVISIONING'
    client.save(update_fields=['status'])

    try:
        subdomain_clean = sanitize_name(client.subdomain)
        sql_db_name = custom_sql_db or f"sisani_tenant_{subdomain_clean}"
        mongo_db_name = custom_mongo_db or f"sisani_mongo_{subdomain_clean}"
        client.database_name = sanitize_name(sql_db_name)
        client.mongo_database_name = sanitize_name(mongo_db_name)
        client.save(update_fields=['database_name', 'mongo_database_name'])
        db_name = client.database_name
        with connection.cursor() as cursor:
            cursor.execute("SHOW DATABASES LIKE %s", [db_name])
            db_exists = cursor.fetchone()

            if not db_exists:
                logger.info(f"Creating SQL database: {db_name}")
                cursor.execute(f"CREATE DATABASE {db_name}")
            else:
                logger.info(f"SQL database already exists: {db_name}")

        db_alias = f"tenant_{client.id}"
        db_config = connections.databases['default'].copy()
        db_config['NAME'] = db_name
        connections.databases[db_alias] = db_config

        logger.info(f"Running migrations on database: {db_name}")
        call_command('migrate', database=db_alias, interactive=False)

        logger.info(f"Seeding default roles in database: {db_name}")
        Role = apps.get_model('sql', 'Role')
        for role_name in ['ADMIN', 'CONTRIBUTOR']:
            Role.objects.using(db_alias).get_or_create(name=role_name)
        mongo_alias = f"mongo_{client.id}"
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/sisani_refactored")        
        from urllib.parse import urlparse, urlunparse
        parsed_uri = urlparse(mongo_uri)
        clean_mongo_uri = urlunparse((parsed_uri.scheme, parsed_uri.netloc, '', '', '', ''))
        
        logger.info(f"Registering MongoDB connection: {client.mongo_database_name}")
        register_connection(
            alias=mongo_alias,
            name=client.mongo_database_name,
            host=clean_mongo_uri
        )
        logger.info(f"Generating admin invitation token for: {client.email}")
        invite_token = secrets.token_urlsafe(32)
        invite_payload = {
            'client_id': client.id,
            'email': client.email,
            'subdomain': client.subdomain
        }
        cache.set(f"admin_invite:{invite_token}", invite_payload, 24 * 3600)
        logger.info(f"Sending setup invitation email to: {client.email}")
        send_tenant_admin_invite_email(
            email_address=client.email,
            token=invite_token,
            subdomain=client.subdomain,
            first_name=client.organization_name
        )

        client.status = 'ACTIVE'
        client.save(update_fields=['status'])
        logger.info(f"Successfully provisioned databases for client: {client.organization_name}")
        return True

    except Exception as e:
        logger.error(f"Failed to provision databases for client: {client.organization_name}. Error: {str(e)}")
        client.status = 'PENDING'
        client.save(update_fields=['status'])
        raise e
