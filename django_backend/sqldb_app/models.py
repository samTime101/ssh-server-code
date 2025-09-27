# REFACTORED BY SAMIP REGMI
# ON SEP 20 2025

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class User(AbstractUser):
    
    userGuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=50, unique=True)
    phonenumber = models.CharField(max_length=20, unique=True)
    firstname = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)

    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.CharField(max_length=30, default="system")
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.CharField(max_length=30, default="system")
    status = models.IntegerField(default=1)

    # DJANGO AUTH FIELDS
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # LOGIN WITH EMAIL
    USERNAME_FIELD = "email" 
    REQUIRED_FIELDS = ["username", "phonenumber", "firstname", "lastname"]

    # FORCE DJANGO TO NOT USE first_name AND last_name FIELDS IN DATABASE
    first_name = None
    last_name = None

class Category(models.Model):
    categoryId = models.AutoField(primary_key=True)
    categoryName = models.CharField(max_length=20, unique=True)

class SubCategory(models.Model):
    subCategoryId = models.AutoField(primary_key=True)
    subCategoryName = models.CharField(max_length=20, unique=True)
    categoryID = models.ForeignKey(Category, on_delete=models.CASCADE)

class SubSubCategory(models.Model):
    subSubCategoryId = models.AutoField(primary_key=True)
    subSubCategoryName = models.CharField(max_length=20, unique=True)
    subCategoryID = models.ForeignKey(SubCategory, on_delete=models.CASCADE)

class Role(models.Model):
    RoleId = models.AutoField(primary_key=True)
    RoleName = models.CharField(max_length=20)
    status = models.IntegerField(default=1)


class UserRole(models.Model):
    RoleID = models.ForeignKey(Role, on_delete=models.CASCADE)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)