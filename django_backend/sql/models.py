from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.contrib.auth.models import BaseUserManager

# REFERNCE LINK : https://testdriven.io/blog/django-custom-user-model/

class UserManager(BaseUserManager):
    def create_user(self, email, username, phonenumber, first_name, last_name, password,role=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
            phonenumber=phonenumber,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save(using=self._db)

        # Default role
        if role is None:
            role, created = Role.objects.get_or_create(name='USER')
        else:
            role, created = Role.objects.get_or_create(name=role)
        UserRole.objects.create(user=user, role=role)
        return user

    def create_superuser(self, email, username, phonenumber, first_name, last_name, password, **extra_fields):
        user = self.create_user(
            email,
            username,
            phonenumber,
            first_name,
            last_name,
            password,
            role="ADMIN",
            **extra_fields
        )
        return user
    
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


    # LOGIN WITH EMAIL
    USERNAME_FIELD = "email" 
    REQUIRED_FIELDS = ("username", "phonenumber", "first_name", "last_name")

class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='user_roles')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'role')
        ordering = ['-assigned_at']

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"