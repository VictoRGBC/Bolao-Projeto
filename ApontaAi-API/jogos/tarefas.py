from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone
from .models import Jogo

def atualizar_jogos_em_andamento():
    agora = timezone.now()
    
    # Busca no banco de dados todos os jogos que ainda estão como 'agendado', 
    # mas cuja data_hora é menor ou igual ao exato momento de agora.
    jogos_iniciados = Jogo.objects.filter(status='agendado', data_hora__lte=agora)
    
    # Se encontrou algum jogo nessa situação, faz o UPDATE em lote
    if jogos_iniciados.exists():
        quantidade = jogos_iniciados.update(status='em_andamento')
        print(f"[{agora.strftime('%H:%M:%S')}] {quantidade} jogo(s) alterado(s) para 'Em Andamento'!")

def iniciar_agendador():
    scheduler = BackgroundScheduler()
    # Configura o robô para rodar a função acima a cada 1 minuto
    scheduler.add_job(atualizar_jogos_em_andamento, 'interval', minutes=1)
    scheduler.start()