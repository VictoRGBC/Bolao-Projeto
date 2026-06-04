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
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'pontuacao_total', 'is_staff']