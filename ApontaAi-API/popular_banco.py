import os
import django
from django.utils import timezone
from datetime import timedelta

# Configura o ambiente do Django para o script rodar por fora
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from jogos.models import Jogo

print("Limpando jogos antigos...")
Jogo.objects.all().delete()

agora = timezone.now()

jogos = [
    Jogo(time_a='Brasil', time_b='França', data_hora=agora + timedelta(days=2)),
    Jogo(time_a='Argentina', time_b='Alemanha', data_hora=agora + timedelta(days=3)),
    Jogo(time_a='Espanha', time_b='Inglaterra', data_hora=agora + timedelta(days=4)),
]

Jogo.objects.bulk_create(jogos)
print("3 jogos criados com sucesso para a Copa de 2026!")