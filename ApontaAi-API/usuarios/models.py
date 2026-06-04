from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    pontuacao_total = models.IntegerField(default=0)
    foto_perfil = models.ImageField(upload_to='perfis/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.foto_perfil:
            self.foto_perfil = f"https://api.dicebear.com/9.x/adventurer/svg?seed={self.username}"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username