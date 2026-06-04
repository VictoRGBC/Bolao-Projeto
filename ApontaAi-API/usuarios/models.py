from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    # O AbstractUser já possui email, senha e campos de admin.
    pontuacao_total = models.IntegerField(default=0)

    def __str__(self):
        return self.username