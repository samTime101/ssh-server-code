from django.db import models

from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# TODO: populate college ko enum from mongo ko model ani college filed ma choices = enum rakhda hunxa, TODO

class User(AbstractUser):
    user_guid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    phonenumber = models.CharField(max_length=10, unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    # aaileko lagi null allowed xa, that means college filed napathuada pani hunxa
    college = models.CharField(max_length=100, null=True, blank=True)

    # LOGIN WITH EMAIL
    USERNAME_FIELD = "email" 
    REQUIRED_FIELDS = ("username", "phonenumber", "first_name", "last_name")