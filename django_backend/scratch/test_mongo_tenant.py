import os
import sys
import django

sys.path.append(r'c:\Users\NITRO\Desktop\codes\projects\sisani-eps-samip\django_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from core.tenant_context import set_tenant_context, clear_tenant_context
from mongo.models import Category
from mongoengine.connection import get_db, _connection_settings
from mongoengine import register_connection

print("Mongo connections configured on start:")
print(list(_connection_settings.keys()))

# Register a test tenant connection (simulating what the middleware does dynamically)
mongo_alias = "mongo_test_tenant"
mongo_db_name = "sisani_mongo_test_tenant"
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/sisani_refactored")

from urllib.parse import urlparse, urlunparse
parsed_uri = urlparse(mongo_uri)
clean_mongo_uri = urlunparse((parsed_uri.scheme, parsed_uri.netloc, '', '', '', ''))

if mongo_alias not in _connection_settings:
    register_connection(
        alias=mongo_alias,
        name=mongo_db_name,
        host=clean_mongo_uri
    )

print(f"\nSetting tenant context to: {mongo_alias} (should write to database: {mongo_db_name})")
set_tenant_context('test_tenant', 'default', mongo_alias)

# Remove any pre-existing test document
Category.objects(name="Multi-Tenant Category Test").delete()

# Create and save a new category under this tenant context
cat = Category(name="Multi-Tenant Category Test")
cat.save()
print("Saved Category document successfully.")

# Query directly from the tenant database to verify
db = get_db(mongo_alias)
print(f"\nQuerying tenant database '{db.name}' directly:")
tenant_docs = list(db['categories'].find({"name": "Multi-Tenant Category Test"}))
print("Found in tenant DB:", tenant_docs)

# Query directly from the default platform database to verify it's NOT there
default_db = get_db('default')
print(f"\nQuerying default database '{default_db.name}' directly:")
default_docs = list(default_db['categories'].find({"name": "Multi-Tenant Category Test"}))
print("Found in default DB:", default_docs)

# Cleanup
Category.objects(name="Multi-Tenant Category Test").delete()
clear_tenant_context()
print("\nCleanup completed.")
