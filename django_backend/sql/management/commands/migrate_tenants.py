from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connections
from sql.models import Client

class Command(BaseCommand):
    help = "Run migrations on the root (default) database and all active/suspended tenant databases"

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("--- Migrating Root Database (default) ---"))
        try:
            call_command('migrate', database='default', interactive=False)
            self.stdout.write(self.style.SUCCESS("Root database migrated successfully.\n"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error migrating Root database: {e}\n"))
            return
        clients = Client.objects.using('default').filter(status__in=['ACTIVE', 'SUSPENDED'])
        if not clients.exists():
            self.stdout.write(self.style.WARNING("No active/suspended tenants found to migrate."))
            return
        for client in clients:
            if not client.database_name:
                self.stdout.write(self.style.WARNING(f"Skipping tenant '{client.organization_name}' (no database name configured)."))
                continue

            self.stdout.write(self.style.MIGRATE_HEADING(f"--- Migrating Tenant: {client.organization_name} (DB: {client.database_name}) ---"))
            db_alias = f"tenant_{client.id}"            
            if db_alias not in connections:
                default_conf = connections.databases['default']
                db_config = default_conf.copy()
                db_config['NAME'] = client.database_name
                connections.databases[db_alias] = db_config

            try:
                call_command('migrate', database=db_alias, interactive=False)
                self.stdout.write(self.style.SUCCESS(f"Tenant database '{client.database_name}' migrated successfully.\n"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error migrating tenant '{client.organization_name}': {e}\n"))
