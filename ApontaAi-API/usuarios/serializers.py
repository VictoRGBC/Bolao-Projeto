from rest_framework import serializers
from .models import Usuario

class UsuarioCadastroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # Força o usuário a preencher o e-mail no momento do cadastro
    email = serializers.EmailField(required=True) 

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password']

    def validate_email(self, value):
        # Regra de negócio: Restringe o domínio
        if not value.endswith('@integrasist.com.br'):
            raise serializers.ValidationError("Cadastro restrito: utilize seu e-mail corporativo (@integrasist.com.br).")
        return value

    def create(self, validated_data):
        usuario = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return usuario

class UsuarioPerfilSerializer(serializers.ModelSerializer):
    # Criamos um campo customizado para garantir que sempre retornaremos uma URL válida
    foto_perfil = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'pontuacao_total', 'foto_perfil', 'is_staff']

    def get_foto_perfil(self, obj):
        # Se o usuário não tem foto, retorna None ou o link do DiceBear que definimos no model
        if obj.foto_perfil:
            # Verifica se é uma URL externa (começa com http) ou um arquivo local
            if str(obj.foto_perfil).startswith('http'):
                return str(obj.foto_perfil)
            # Se for local, retorna a URL absoluta
            return obj.foto_perfil.url
        return None
    
class UsuarioPerfilSerializer(serializers.ModelSerializer):
    foto_perfil = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'pontuacao_total', 'foto_perfil', 'is_staff']

    def get_foto_perfil(self, obj):
        # Se tem foto, retorna a URL da imagem
        if obj.foto_perfil:
            # Verifica se é uma URL externa (já é do DiceBear)
            if str(obj.foto_perfil).startswith('http'):
                return str(obj.foto_perfil)
            return obj.foto_perfil.url
        
        # SE NÃO TEM FOTO (foi removida), gera a URL do DiceBear agora!
        return f"https://api.dicebear.com/9.x/adventurer/svg?seed={obj.username}"