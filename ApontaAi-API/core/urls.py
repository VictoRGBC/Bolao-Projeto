from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from usuarios.views import UsuarioViewSet
from jogos.views import JogoViewSet
from palpites.views import PalpiteViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'jogos', JogoViewSet, basename='jogo')
router.register(r'palpites', PalpiteViewSet, basename='palpite')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Endpoints de Autenticação / Login
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Faz o Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Renova o Token
]