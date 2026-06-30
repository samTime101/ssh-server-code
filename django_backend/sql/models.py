from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from core.constants.roles import ROLE_USER
from sql.managers.user_manager import UserManager

class Role(models.Model):
    name = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        # DONT ALLOW CREATION OF ROLE WITH NAME "USER" BECAUSE IT IS VIRTUAL ROLE
        if self.name.upper() == ROLE_USER:
            raise ValueError("FROM MODEL: USER role is virtual and cannot be created.")
        super().save(*args, **kwargs)

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
        if ROLE_USER not in roles:
            roles.append(ROLE_USER)
        return roles

    def has_role(self, role_name):
        if role_name == ROLE_USER:
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


class Subscription(models.Model):
    plan_name = models.CharField(max_length=50)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.ImageField(upload_to='subscription_images/', null=True, blank=True)
    number_of_months = models.PositiveIntegerField()
    status = models.BooleanField(default=False)

    class Meta:
        ordering = ['plan_name']

    def __str__(self):
        return f"{self.plan_name}"
    
    def delete(self, *args, **kwargs):
        if self.image:
            self.image.delete(save=False)
        super().delete(*args, **kwargs)