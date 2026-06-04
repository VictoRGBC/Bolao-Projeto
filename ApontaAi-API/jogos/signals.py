from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Jogo
from usuarios.models import Usuario
from palpites.models import Palpite

def recalcular_pontuacoes_usuarios():
    # 1. Zera as pontuações primeiro para evitar soma duplicada caso o admin edite o jogo várias vezes
    Usuario.objects.update(pontuacao_total=0)
    Palpite.objects.update(pontuou=False)

    # 2. Pega todos os jogos finalizados que possuem um resultado definido
    jogos_finalizados = Jogo.objects.filter(status='finalizado').exclude(resultado__isnull=True).exclude(resultado='')

    # 3. Atualiza os palpites que acertaram o resultado
    for jogo in jogos_finalizados:
        # Marca 'pontuou=True' para todos os palpites onde a escolha foi igual ao resultado real do jogo
        Palpite.objects.filter(jogo=jogo, escolha=jogo.resultado).update(pontuou=True)

    # 4. Calcula e salva o saldo final de cada usuário (10 pontos por acerto)
    for usuario in Usuario.objects.all():
        total_acertos = Palpite.objects.filter(usuario=usuario, pontuou=True).count()
        usuario.pontuacao_total = total_acertos * 10
        usuario.save()

# Aciona o recálculo sempre que um Jogo for Salvo ou Atualizado
@receiver(post_save, sender=Jogo)
def atualizar_pontuacao_ao_salvar(sender, instance, **kwargs):
    recalcular_pontuacoes_usuarios()

# Aciona o recálculo sempre que um Jogo for Deletado
@receiver(post_delete, sender=Jogo)
def atualizar_pontuacao_ao_deletar(sender, instance, **kwargs):
    recalcular_pontuacoes_usuarios()