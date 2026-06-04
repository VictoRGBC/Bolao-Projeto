import os
import django
from jogos.models import Grupo, Time

print("Limpando banco de dados de times antigos...")
Time.objects.all().delete()
Grupo.objects.all().delete()

grupos_dados = {
    'A': ['Mexico', 'Africa do Sul', 'Coreia do Sul', 'Republica Tcheca'],
    'B': ['Canada', 'Bosnia e Herzegovina', 'Catar', 'Suica'],
    'C': ['Brasil', 'Marrocos', 'Haiti', 'Escocia'],
    'D': ['Estados Unidos', 'Paraguai', 'Australia', 'Turquia'],
    'E': ['Alemanha', 'Curacau', 'Costa do Marfim', 'Equador'],
    'F': ['Holanda', 'Japao', 'Suecia', 'Tunisia'],
    'G': ['Belgica', 'Egito', 'Ira', 'Nova Zelandia'],
    'H': ['Espanha', 'Cabo Verde', 'Arabia Saudita', 'Uruguai'],
    'I': ['Franca', 'Senegal', 'Iraque', 'Noruega'],
    'J': ['Argentina', 'Argelia', 'Austria', 'Jordania'],
    'K': ['Portugal', 'RD Congo', 'Uzbequistao', 'Colombia'],
    'L': ['Inglaterra', 'Croacia', 'Gana', 'Panama'],
}

print("Criando novos grupos e times (sem caracteres especiais)...")

for letra, times in grupos_dados.items():
    grupo, _ = Grupo.objects.get_or_create(nome=letra)
    for nome_time in times:
        Time.objects.get_or_create(nome=nome_time, grupo=grupo)

print("Tudo pronto! Todos os 48 times e 12 grupos foram recadastrados com sucesso de forma limpa.")