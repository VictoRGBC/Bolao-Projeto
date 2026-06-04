import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Controle de estado (se o usuário está na tela de Login ou Cadastro)
    const [isLogin, setIsLogin] = useState(true);
    
    // Estados dos campos do formulário
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Estados de feedback visual
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Fluxo de Login
                await login(username, password);
                navigate('/dashboard'); // Redireciona após o sucesso
            } else {
                // Fluxo de Cadastro com Validação de Domínio no Front-end
                if (!email.endsWith('@integrasist.com.br')) {
                    setError('O cadastro é restrito para e-mails @integrasist.com.br');
                    setLoading(false);
                    return;
                }

                // Dispara para a nossa API do Django criar o usuário
                await api.post('/usuarios/', {
                    username,
                    email,
                    password
                });

                // Se criou com sucesso, já faz o login automático
                await login(username, password);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Pega a mensagem de erro que o Django enviou (ex: usuário já existe)
                setError(JSON.stringify(err.response.data));
            } else {
                setError('Ocorreu um erro ao conectar com o servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Integra Bolão 2026</h1>
                <p style={styles.subtitle}>
                    {isLogin ? 'Acesse sua conta para palpitar' : 'Cadastre-se com seu e-mail corporativo'}
                </p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome de Usuário</label>
                        <input 
                            type="text" 
                            required 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="ex: joao.silva"
                        />
                    </div>

                    {!isLogin && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>E-mail Corporativo</label>
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                placeholder="ex: joao@integrasist.com.br"
                            />
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha</label>
                        <input 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                    </button>
                </form>

                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                    style={styles.toggleButton}
                >
                    {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                </button>
            </div>
        </div>
    );
}

// Estilos embutidos para manter a simplicidade sem precisar instalar frameworks CSS agora.
const styles = {
    container: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'sans-serif'
    },
    card: {
        backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px'
    },
    title: {
        fontSize: '24px', fontWeight: 'bold', color: '#1e40af', textAlign: 'center', margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '20px'
    },
    form: {
        display: 'flex', flexDirection: 'column', gap: '15px'
    },
    inputGroup: {
        display: 'flex', flexDirection: 'column', gap: '5px'
    },
    label: {
        fontSize: '14px', color: '#334155', fontWeight: '500'
    },
    input: {
        padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px'
    },
    button: {
        padding: '12px', backgroundColor: '#1e40af', color: '#ffffff', border: 'none', 
        borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px'
    },
    toggleButton: {
        background: 'none', border: 'none', color: '#3b82f6', fontSize: '14px', 
        cursor: 'pointer', marginTop: '20px', width: '100%', textDecoration: 'underline'
    },
    errorBox: {
        backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', 
        borderRadius: '6px', fontSize: '14px', marginBottom: '15px', textAlign: 'center'
    }
};