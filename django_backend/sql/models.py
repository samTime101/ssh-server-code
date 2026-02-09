from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.contrib.auth.models import BaseUserManager

# REFERNCE LINK : https://testdriven.io/blog/django-custom-user-model/

class UserManager(BaseUserManager):
    try:
        def create_user(self, email, username, phonenumber, first_name, last_name, password,college=None,role=None,email_verified = False,**extra_fields):
            if not email:
                raise ValueError("The Email field must be set")
            email = self.normalize_email(email)
            user = self.model(
                email=email,
                username=username,
                phonenumber=phonenumber,
                first_name=first_name,
                last_name=last_name,
                college=college,
            )
            user.set_password(password)
            user.is_email_verified = email_verified
            user.save(using=self._db)

            # Default role
            # if role is None:
            #     role, created = Role.objects.get_or_create(name='USER')
            # else:
            #     role, created = Role.objects.get_or_create(name=role)

            if role and role != "USER":
                role, created = Role.objects.get_or_create(name=role)
                UserRole.objects.create(user=user, role=role)
            return user
    except Exception as e:
        raise ValueError(f"User creation failed: {e}")

    def create_superuser(self, email, username, phonenumber, first_name, last_name, password, **extra_fields):
        try:
            user = self.create_user(
                email,
                username,
                phonenumber,
                first_name,
                last_name,
                password,
                role="ADMIN",
                email_verified=True,
                **extra_fields
            )
            return user
        except Exception as e:
            raise ValueError(f"Superuser creation failed: {e}")
    
class Role(models.Model):
    name = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class User(AbstractUser):
    user_guid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    phonenumber = models.CharField(max_length=10, unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    # aaileko lagi null allowed xa, that means college filed napathuada pani hunxa
    college = models.CharField(max_length=100, null=True, blank=True)
    objects = UserManager()
    # Disabling is_active, is_staff, is_superuser from AbstractUser
    is_staff = None
    is_superuser = None
    is_email_verified = models.BooleanField(default=False)

    # LOGIN WITH EMAIL
    USERNAME_FIELD = "email" 
    REQUIRED_FIELDS = ("username", "phonenumber", "first_name", "last_name")

    def get_roles(self):
        roles = list(self.user_roles.values_list("role__name", flat=True))
        if "USER" not in roles:
            roles.append("USER")

        return roles

    def has_role(self, role_name):
        if role_name == "USER":
            return True
        return self.user_roles.filter(role__name=role_name).exists()

class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='user_roles')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'role')
        ordering = ['-assigned_at']

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"