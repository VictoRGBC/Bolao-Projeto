import os
import json
import django

# Garante o carregamento do ambiente do Django caso seja executado diretamente
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from jogos.models import Jogo

# Define o nome do arquivo JSON que contém os dados da rodada
ARQUIVO_JSON = 'gemini-code-1780599903514.json'

print("Limpando jogos existentes no banco para evitar duplicidades...")
Jogo.objects.all().delete()

try:
    # Abre e efetua a leitura do payload JSON
    with open(ARQUIVO_JSON, 'r', encoding='utf-8') as arquivo:
        jogos_fixtures = json.load(arquivo)

    print(f"Lendo {len(jogos_fixtures)} partidas do arquivo {ARQUIVO_JSON}...")

    jogos_criados = 0
    for jogo in jogos_fixtures:
        Jogo.objects.create(
            time_a=jogo["time_a"],
            time_b=jogo["time_b"],
            data_hora=jogo["data_hora"],
            status="agendado"
        )
        jogos_criados += 1

    print(f"✅ Sucesso! {jogos_criados} jogos foram inseridos no Integra Bolão.")

except FileNotFoundError:
    print(f"❌ Erro: O arquivo '{ARQUIVO_JSON}' não foi encontrado na raiz do projeto.")
    print("Por favor, mova o arquivo JSON para a mesma pasta do 'manage.py'.")
except json.JSONDecodeError:
    print(f"❌ Erro: O arquivo '{ARQUIVO_JSON}' contém uma formatação de JSON inválida.")
except Exception as e:
    print(f"❌ Erro inesperado: {str(e)}")