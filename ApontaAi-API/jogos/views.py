from rest_framework import viewsets, permissions
from .models import Jogo
from .serializers import JogoSerializer

class JogoViewSet(viewsets.ModelViewSet):
    queryset = Jogo.objects.all().order_by('data_hora')
    serializer_class = JogoSerializer
    # Permite que qualquer um (logado ou não) veja os jogos. Mas só admin pode alterar.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]