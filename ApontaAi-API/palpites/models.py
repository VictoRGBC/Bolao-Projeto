from django.db import models
from django.conf import settings
from jogos.models import Jogo

class Palpite(models.Model):
    ESCOLHA_CHOICES = [
        ('vitoria_a', 'Vitória Time A'),
        ('vitoria_b', 'Vitória Time B'),
        ('empate', 'Empate'),
    ]

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='palpites')
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, related_name='palpites')
    escolha = models.CharField(max_length=20, choices=ESCOLHA_CHOICES)
    pontuou = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"Palpite de {self.usuario.username} no jogo {self.jogo}"