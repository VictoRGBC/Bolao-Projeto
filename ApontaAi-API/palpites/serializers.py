from rest_framework import serializers
from .models import Palpite

class PalpiteSerializer(serializers.ModelSerializer):
    # O usuário logado será associado automaticamente na View, então deixamos read_only
    usuario = serializers.PrimaryKeyRelatedField(read_only=True)
    pontuou = serializers.BooleanField(read_only=True)

    class Meta:
        model = Palpite
        fields = ['id', 'usuario', 'jogo', 'escolha', 'pontuou']

    def validate(self, data):
        # Validação extra: O palpite só pode ser feito se o jogo ainda estiver 'agendado'
        jogo = data['jogo']
        if jogo.status != 'agendado':
            raise serializers.ValidationError("Não é possível palpitar em um jogo que já começou ou terminou.")
        return data