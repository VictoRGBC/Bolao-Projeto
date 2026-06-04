import axios from 'axios';

// Cria uma instância do axios apontando para a URL definida no nosso .env
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptador: Antes de qualquer requisição sair, ele verifica se existe um token salvo
api.interceptors.request.use(async config => {
    // Buscaremos o token no armazenamento do navegador
    const token = localStorage.getItem('@IntegraBolao:token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;