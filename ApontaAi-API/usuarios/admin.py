from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class CustomUserAdmin(UserAdmin):
    # Adiciona a pontuação na lista de utilizadores
    list_display = ['username', 'email', 'pontuacao_total', 'is_staff']
    
    # Adiciona o campo dentro da página de edição do utilizador
    fieldsets = UserAdmin.fieldsets + (
        ('Informações do Bolão', {'fields': ('pontuacao_total',)}),
    )

admin.site.register(Usuario, CustomUserAdmin)