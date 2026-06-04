from django.apps import AppConfig
import os

class JogosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'jogos'

    def ready(self):
        # 1. LIGA O MOTOR DE PONTUAÇÃO (Isso garante que o signals.py seja executado)
        import jogos.signals

        # 2. Mantém o seu agendador de tarefas intacto
        if os.environ.get('RUN_MAIN', None) == 'true':
            from . import tarefas
            tarefas.iniciar_agendador()