import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Gerencia o modo da tela: 'login' | 'cadastro' | 'recuperar'
    const [modo, setModo] = useState('login');
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [feedback, setFeedback] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ texto: '', tipo: '' });
        setLoading(true);

        try {
            if (modo === 'login') {
                await login(username, password);
                navigate('/dashboard');
            } 
            else if (modo === 'cadastro') {
                if (!email.endsWith('@integrasist.com.br')) {
                    setFeedback({ texto: 'O cadastro é restrito para e-mails @integrasist.com.br', tipo: 'erro' });
                    setLoading(false);
                    return;
                }
                await api.post('/usuarios/', { username, email, password });
                await login(username, password);
                navigate('/dashboard');
            } 
            else if (modo === 'recuperar') {
                await api.post('/usuarios/alterar-senha-login/', { username, email, password });
                setFeedback({ texto: '🎉 Senha alterada com sucesso! Faça login.', tipo: 'sucesso' });
                setModo('login');
                setPassword(''); // Limpa a senha para ele digitar novamente no login
            }
        } catch (err) {
            console.error(err);
            const msgErro = err.response?.data?.error || err.response?.data?.detail || 'Ocorreu um erro na operação.';
            setFeedback({ texto: `❌ ${msgErro}`, tipo: 'erro' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Integra Bolão 2026</h1>
                <p style={styles.subtitle}>
                    {modo === 'login' && 'Acesse sua conta para palpitar'}
                    {modo === 'cadastro' && 'Cadastre-se com seu e-mail corporativo'}
                    {modo === 'recuperar' && 'Redefina sua senha corporativa'}
                </p>

                {feedback.texto && (
                    <div style={feedback.tipo === 'sucesso' ? styles.msgSucesso : styles.msgErro}>
                        {feedback.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome de Usuário</label>
                        <input type="text" required value={username} onChange={e => setUsername(e.target.value)} style={styles.input} placeholder="ex: joao.silva" />
                    </div>

                    {/* O E-mail só aparece no Cadastro ou na Recuperação */}
                    {modo !== 'login' && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>E-mail Corporativo</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={styles.input} placeholder="ex: joao@integrasist.com.br" />
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            {modo === 'recuperar' ? 'Nova Senha' : 'Senha'}
                        </label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={styles.input} />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Processando...' : (modo === 'login' ? 'Entrar' : modo === 'cadastro' ? 'Criar Conta' : 'Alterar Senha')}
                    </button>
                </form>

                {/* Aqui estão os botões do rodapé que controlam o estado da tela */}
                <div style={styles.footerLinks}>
                    {modo === 'login' ? (
                        <>
                            <button onClick={() => { setModo('cadastro'); setFeedback({texto:'',tipo:''}); }} type="button" style={styles.toggleButton}>Não tem conta? Cadastre-se</button>
                            <button onClick={() => { setModo('recuperar'); setFeedback({texto:'',tipo:''}); }} type="button" style={styles.toggleButton}>Esqueceu a senha?</button>
                        </>
                    ) : (
                        <button onClick={() => { setModo('login'); setFeedback({texto:'',tipo:''}); }} type="button" style={styles.toggleButton}>Voltar para o Login</button>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'sans-serif' },
    card: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#1e40af', textAlign: 'center', margin: '0 0 10px 0' },
    subtitle: { fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '14px', color: '#334155', fontWeight: '500' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px' },
    button: { padding: '12px', backgroundColor: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    footerLinks: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', alignItems: 'center' },
    toggleButton: { background: 'none', border: 'none', color: '#3b82f6', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline', padding: '5px' },
    msgSucesso: { backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px', textAlign: 'center' },
    msgErro: { backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px', textAlign: 'center' }
};