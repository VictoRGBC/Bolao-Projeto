from rest_framework import serializers
from django.utils import timezone
from .models import Palpite

class PalpiteSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(read_only=True)
    pontuou = serializers.BooleanField(read_only=True)

    class Meta:
        model = Palpite
        fields = ['id', 'usuario', 'jogo', 'escolha', 'pontuou']

    def validate(self, data):
        # Se self.instance existir, significa que é uma ATUALIZAÇÃO (PATCH)
        # Caso contrário, é uma CRIAÇÃO (POST)
        jogo = self.instance.jogo if self.instance else data.get('jogo')
        
        if not jogo:
            raise serializers.ValidationError("Jogo não especificado.")
            
        agora = timezone.now()

        # Bloqueia tanto a criação quanto a alteração se o tempo esgotou
        if jogo.status != 'agendado' or jogo.data_hora <= agora:
            raise serializers.ValidationError("Tempo esgotado! O jogo já começou ou foi finalizado.")
        
        return data