from django.contrib.auth.models import BaseUserManager
from core.constants.roles import ROLE_USER
from django.apps import apps
# REFERNCE LINK : https://testdriven.io/blog/django-custom-user-model/
# usermanager class as it is moved from models.py

# restore ko lagi if usermanager ma kei error aayo vaney:
#  https://github.com/sisani9/sisani-eps/blob/0eb5a67ff8ed741f41d2d37fe03aa0319c573885/django_backend/sql/models.py

class UserManager(BaseUserManager):
    def create_user(self,email,username,phonenumber,first_name,last_name,password,college=None,role=None,email_verified=False,**extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email,username=username,phonenumber=phonenumber,first_name=first_name,last_name=last_name,college=college,)
        user.set_password(password)
        user.is_email_verified = email_verified
        user.save(using=self._db)
        Role = apps.get_model('sql', 'Role')
        UserRole = apps.get_model('sql', 'UserRole')
        if role and role != ROLE_USER:
            role, _ = Role.objects.using(self._db).get_or_create(name=role)
            UserRole.objects.using(self._db).create(user=user, role=role)
        return user

    def create_superuser(self,email,username,phonenumber,first_name,last_name,password,**extra_fields):
        user = self.create_user(email,username,phonenumber,first_name,last_name,password,role="ADMIN",email_verified=True,**extra_fields)
        return user