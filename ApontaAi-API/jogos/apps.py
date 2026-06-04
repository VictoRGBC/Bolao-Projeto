from django.apps import AppConfig
import os

class JogosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'jogos'

    def ready(self):
        # Mantém a importação do Signal que fizemos anteriormente
        import jogos.signals
        
        # Inicia o agendador de tarefas automático
        # A condicional RUN_MAIN == 'true' impede que o agendador rode duas vezes 
        # por conta do sistema de "auto-reload" (Hot Reload) do servidor de desenvolvimento do Django.
        if os.environ.get('RUN_MAIN', None) == 'true':
            from . import tarefas
            tarefas.iniciar_agendador()