from django.apps import AppConfig

class JogosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'jogos'

    def ready(self):
        # Importa os signals quando o app é inicializado
        import jogos.signals