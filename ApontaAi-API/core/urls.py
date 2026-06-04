from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# Importações do SimpleJWT para o Login
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from usuarios.views import UsuarioViewSet
from jogos.views import JogoViewSet
from palpites.views import PalpiteViewSet

# Configuração do Router
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'jogos', JogoViewSet, basename='jogo')
router.register(r'palpites', PalpiteViewSet, basename='palpite')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rotas de Autenticação JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rotas da nossa API (somente usuários, jogos e palpites agora)
    path('api/', include(router.urls)),
]

# Roteamento dos arquivos de mídia (Fotos de Perfil) durante o desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)