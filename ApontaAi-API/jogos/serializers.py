from rest_framework import serializers
from .models import Jogo

class JogoSerializer(serializers.ModelSerializer):
    # Formata a exibição da data para ficar mais amigável no JSON
    data_hora = serializers.DateTimeField(format="%d/%m/%Y %H:%M")

    class Meta:
        model = Jogo
        fields = ['id', 'time_a', 'time_b', 'data_hora', 'status', 'resultado']