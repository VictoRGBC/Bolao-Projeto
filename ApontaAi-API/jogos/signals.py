from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from django.db.models import F

from .models import Jogo
from palpites.models import Palpite
from usuarios.models import Usuario

@receiver(post_save, sender=Jogo)
def processar_resultado_jogo(sender, instance, **kwargs):
    # Verifica se o jogo acabou e se tem um resultado válido
    if instance.status == 'finalizado' and instance.resultado:
        
        # O transaction.atomic garante que, se algo falhar no meio, nenhuma alteração
        # parcial seja salva no banco de dados (Rollback automático).
        with transaction.atomic():
            
            # 1. Identifica os palpites corretos
            palpites_corretos = Palpite.objects.filter(jogo=instance, escolha=instance.resultado, pontuou__isnull=True)
            
            # 2. Identifica os palpites errados
            palpites_errados = Palpite.objects.filter(jogo=instance, pontuou__isnull=True).exclude(escolha=instance.resultado)
            
            # 3. Extrai apenas os IDs dos usuários que acertaram para atualizar as pontuações em lote
            usuarios_ganhadores_ids = palpites_corretos.values_list('usuario_id', flat=True)
            
            # 4. Atualiza a pontuação dos usuários no banco de dados (exemplo: 10 pontos por acerto)
            if usuarios_ganhadores_ids.exists():
                Usuario.objects.filter(id__in=usuarios_ganhadores_ids).update(
                    pontuacao_total=F('pontuacao_total') + 10
                )
            
            # 5. Por fim, marca o status do palpite para que não seja pontuado duas vezes
            palpites_corretos.update(pontuou=True)
            palpites_errados.update(pontuou=False)