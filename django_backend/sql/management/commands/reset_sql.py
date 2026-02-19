# python manage.py reset_sql , sabai sql tables haru drop garxa
from django.core.management.base import BaseCommand
from sql.models import User, Role, UserRole

class Command(BaseCommand):
    help = "RESET SQL DB BY DROPPING ALL TABLES"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Dropping all SQL tables..."))
        self.drop_tables()
        self.stdout.write(self.style.SUCCESS("All SQL tables dropped successfully."))

    def drop_tables(self):
        UserRole.objects.all().delete()
        Role.objects.all().delete()
        User.objects.all().delete()