from rest_framework import viewsets, permissions
from .models import Jogo
from .serializers import JogoSerializer

class JogoViewSet(viewsets.ModelViewSet):
    queryset = Jogo.objects.all().order_by('data_hora')
    serializer_class = JogoSerializer
    
    # Permite que qualquer um leia os jogos, mas apenas admin pode criar/editar/deletar
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]