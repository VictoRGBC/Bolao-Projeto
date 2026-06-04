from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    pontuacao_total = models.IntegerField(default=0)
    foto_perfil = models.ImageField(upload_to='perfis/', null=True, blank=True)

    def __str__(self):
        return self.username