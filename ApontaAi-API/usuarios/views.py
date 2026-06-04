from rest_framework import viewsets, permissions
from .models import Usuario
from .serializers import UsuarioCadastroSerializer, UsuarioPerfilSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()

    def get_serializer_class(self):
        # Usa o serializer com senha para cadastro e o sem senha para visualização
        if self.action == 'create':
            return UsuarioCadastroSerializer
        return UsuarioPerfilSerializer

    def get_permissions(self):
        # Libera o cadastro (POST) para qualquer um, mas protege o resto
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]