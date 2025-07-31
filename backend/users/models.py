from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.

class USER(models.USER):

    username = models.CompositePrimaryKey(
        max_length=150,)


