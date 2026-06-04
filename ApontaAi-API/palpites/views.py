from rest_framework import viewsets, permissions
from .models import Palpite
from .serializers import PalpiteSerializer

class PalpiteViewSet(viewsets.ModelViewSet):
    serializer_class = PalpiteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtra para que o usuário veja apenas os seus próprios palpites
        return Palpite.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Salva o palpite passando o usuário que está autenticado no momento
        serializer.save(usuario=self.request.user)