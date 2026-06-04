import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ao carregar o site, verifica se já existe um token e usuário salvos
        const recoveredUser = localStorage.getItem('@IntegraBolao:user');
        const token = localStorage.getItem('@IntegraBolao:token');

        if (recoveredUser && token) {
            setUser(JSON.parse(recoveredUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // Chama a nossa API do Django
        const response = await api.post('/token/', { username, password });
        
        const { access } = response.data;
        
        // Para simplificar, vamos buscar os dados do perfil após o login
        const profileRes = await api.get('/usuarios/', {
            headers: { Authorization: `Bearer ${access}` }
        });
        
        const userData = profileRes.data.find(u => u.username === username);

        localStorage.setItem('@IntegraBolao:token', access);
        localStorage.setItem('@IntegraBolao:user', JSON.stringify(userData));

        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('@IntegraBolao:token');
        localStorage.removeItem('@IntegraBolao:user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};