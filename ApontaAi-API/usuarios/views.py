from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import Usuario
from .serializers import UsuarioCadastroSerializer, UsuarioPerfilSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCadastroSerializer
        return UsuarioPerfilSerializer

    def get_permissions(self):
        if self.action in ['create', 'alterar_senha_login']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    # 1. Endpoint do Perfil (Autenticado)
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        usuario = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)
            
        elif request.method in ['PUT', 'PATCH']:
            # Captura a senha se ela foi enviada no formulário de perfil
            nova_senha = request.data.get('password')
            
            serializer = self.get_serializer(usuario, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            # Se uma nova senha foi preenchida, aplica a criptografia e salva
            if nova_senha:
                usuario.set_password(nova_senha)
                usuario.save()

            return Response(serializer.data)

    # 2. Endpoint Público para Alterar Senha no Login (Não Autenticado)
    @action(detail=False, methods=['post'], url_path='alterar-senha-login')
    def alterar_senha_login(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        nova_senha = request.data.get('password')

        if not username or not email or not nova_senha:
            return Response({"error": "Todos os campos são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Busca o usuário validando o duplo fator (username E email)
            usuario = Usuario.objects.get(username=username, email=email)
            usuario.set_password(nova_senha)
            usuario.save()
            return Response({"success": "Senha redefinida com sucesso!"}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuário ou e-mail corporativo não conferem."}, status=status.HTTP_404_NOT_FOUND)