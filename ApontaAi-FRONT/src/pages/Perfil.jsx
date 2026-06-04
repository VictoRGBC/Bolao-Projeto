import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export default function Perfil() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estados do formulário preenchidos dinamicamente
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    
    // Estados para alteração de senha
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [fotoArquivo, setFotoArquivo] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const [palpites, setPalpites] = useState([]);
    const [jogos, setJogos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    // Preenche os inputs automaticamente assim que o contexto do usuário carregar
    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setEmail(user.email || '');
            setPreviewUrl(user.foto_perfil || '');
        }
        carregarHistorico();
    }, [user]);

    const carregarHistorico = async () => {
        try {
            const [resPalpites, resJogos] = await Promise.all([
                api.get('/palpites/'),
                api.get('/jogos/')
            ]);
            setPalpites(resPalpites.data);
            setJogos(resJogos.data);
        } catch (error) {
            console.error("Erro ao carregar histórico", error);
        }
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoArquivo(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSalvarPerfil = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });

        // Validação da troca de senha voluntária
        if (password && password !== confirmPassword) {
            setMensagem({ texto: '❌ As senhas não conferem.', tipo: 'erro' });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        
        if (password) {
            formData.append('password', password);
        }
        if (fotoArquivo) {
            formData.append('foto_perfil', fotoArquivo);
        }

        try {
            const response = await api.patch('/usuarios/me/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMensagem({ texto: '✅ Perfil atualizado com sucesso!', tipo: 'sucesso' });
            localStorage.setItem('@IntegraBolao:user', JSON.stringify(response.data));
            
            // Limpa os campos de senha após salvar com sucesso
            setPassword('');
            setConfirmPassword('');
            
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            setMensagem({ texto: '❌ Erro ao atualizar as informações.', tipo: 'erro' });
        } finally {
            setLoading(false);
        }
    };

    const obterPalpitesPorStatus = (tipo) => {
        return palpites.filter(palpite => {
            const jogo = jogos.find(j => j.id === palpite.jogo);
            if (!jogo) return false;
            if (tipo === 'andamento') return jogo.status === 'em_andamento';
            if (tipo === 'acertos') return jogo.status === 'finalizado' && palpite.pontuou === true;
            if (tipo === 'erros') return jogo.status === 'finalizado' && palpite.pontuou === false;
            return false;
        });
    };

    const renderListaPalpites = (lista) => {
        if (lista.length === 0) return <p style={styles.emptyText}>Nenhum registro.</p>;
        return lista.map(p => {
            const jogo = jogos.find(j => j.id === p.jogo);
            return (
                <div key={p.id} style={styles.historyCard}>
                    <span><strong>{jogo?.time_a} x {jogo?.time_b}</strong></span>
                    <span style={styles.historyChoice}>Palpite: {p.escolha.replace('_', ' ')}</span>
                </div>
            );
        });
    };

    return (
        <div style={styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.navBrand}>Integra Bolão ⚽</div>
                <button onClick={() => navigate('/dashboard')} style={styles.navButton}>⬅ Voltar ao Painel</button>
            </nav>

            <main style={styles.container}>
                <div style={styles.profileSection}>
                    <div style={styles.card}>
                        <h2 style={styles.title}>Meus Dados Pessoais</h2>
                        {mensagem.texto && (
                            <div style={mensagem.tipo === 'sucesso' ? styles.msgSucesso : styles.msgErro}>
                                {mensagem.texto}
                            </div>
                        )}
                        
                        <form onSubmit={handleSalvarPerfil} style={styles.form}>
                            <div style={styles.avatarWrapper}>
                                <img src={previewUrl || 'https://via.placeholder.com/100'} alt="Avatar" style={styles.avatarPreview} />
                                <input type="file" accept="image/*" onChange={handleFotoChange} style={styles.fileInput} id="fileAvatar"/>
                                <label htmlFor="fileAvatar" style={styles.fileLabel}>Alterar Foto</label>
                            </div>

                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Nome de Usuário</label>
                                    <input style={{...styles.input, backgroundColor: '#f1f5f9'}} value={username} disabled />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>E-mail</label>
                                    <input style={{...styles.input, backgroundColor: '#f1f5f9'}} value={email} disabled />
                                </div>
                            </div>

                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Nome</label>
                                    <input style={styles.input} value={firstName} onChange={e => setFirstName(e.target.value)} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Sobrenome</label>
                                    <input style={styles.input} value={lastName} onChange={e => setLastName(e.target.value)} />
                                </div>
                            </div>

                            <h3 style={styles.sectionSubtitle}>🔒 Alterar Senha (Opcional)</h3>
                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Nova Senha</label>
                                    <input type="password" style={styles.input} value={password} onChange={e => setPassword(e.target.value)} placeholder="Deixe em branco para manter" />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Confirmar Nova Senha</label>
                                    <input type="password" style={styles.input} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} style={styles.button}>
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </form>
                    </div>

                    <div style={styles.cardHistory}>
                        <h2 style={styles.title}>Meu Rendimento</h2>
                        <h3 style={styles.subTitle}>🏃‍♂️ Em Andamento</h3>
                        {renderListaPalpites(obterPalpitesPorStatus('andamento'))}
                        <h3 style={{...styles.subTitle, color: '#166534'}}>🎉 Acertos</h3>
                        {renderListaPalpites(obterPalpitesPorStatus('acertos'))}
                        <h3 style={{...styles.subTitle, color: '#b91c1c'}}>❌ Erros</h3>
                        {renderListaPalpites(obterPalpitesPorStatus('erros'))}
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
    navbar: { backgroundColor: '#1e40af', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
    navBrand: { fontSize: '20px', fontWeight: 'bold' },
    navButton: { background: 'none', border: '1px solid white', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    container: { maxWidth: '1100px', margin: '40px auto', padding: '0 20px' },
    profileSection: { display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '30px' },
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    cardHistory: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    title: { color: '#0f172a', margin: '0 0 20px 0', fontSize: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
    sectionSubtitle: { fontSize: '14px', color: '#1e40af', marginTop: '25px', marginBottom: '10px', fontWeight: 'bold' },
    subTitle: { fontSize: '13px', color: '#475569', margin: '20px 0 10px 0', fontWeight: 'bold', textTransform: 'uppercase' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'flex', gap: '15px' },
    avatarWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '10px' },
    avatarPreview: { width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1e40af' },
    fileInput: { display: 'none' },
    fileLabel: { color: '#1e40af', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
    label: { fontSize: '13px', color: '#475569', fontWeight: '600' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px' },
    button: { padding: '12px', backgroundColor: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' },
    msgSucesso: { backgroundColor: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' },
    msgErro: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' },
    emptyText: { color: '#94a3b8', fontStyle: 'italic', fontSize: '13px', margin: '0' },
    historyCard: { display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', marginBottom: '6px', borderLeft: '3px solid #cbd5e1', fontSize: '13px' },
    historyChoice: { color: '#64748b', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }
};