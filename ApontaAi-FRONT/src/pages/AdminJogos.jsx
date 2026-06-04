import { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export default function AdminJogos() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estados do Formulário
    const [timeA, setTimeA] = useState('');
    const [timeB, setTimeB] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [status, setStatus] = useState('agendado');
    const [resultado, setResultado] = useState('');
    
    // Estados de Controle
    const [jogos, setJogos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    useEffect(() => {
        carregarJogos();
    }, []);

    const carregarJogos = async () => {
        try {
            const res = await api.get('/jogos/');
            setJogos(res.data);
        } catch (error) {
            console.error("Erro ao carregar jogos", error);
        }
    };

    if (!user?.is_staff) return <Navigate to="/dashboard" />;

    // Máscara de Data Brasileira (DD/MM/AAAA HH:MM)
    const handleDataHoraChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 12) val = val.substring(0, 12);
        let formatted = val;
        if (val.length > 2) formatted = val.substring(0, 2) + '/' + val.substring(2);
        if (val.length > 4) formatted = formatted.substring(0, 5) + '/' + formatted.substring(5);
        if (val.length > 8) formatted = formatted.substring(0, 10) + ' ' + formatted.substring(10);
        if (val.length > 10) formatted = formatted.substring(0, 13) + ':' + formatted.substring(13);
        setDataHora(formatted);
    };

    // Prepara o formulário para edição
    const handleEditClick = (jogo) => {
        setEditingId(jogo.id);
        setTimeA(jogo.time_a);
        setTimeB(jogo.time_b);
        setStatus(jogo.status);
        setResultado(jogo.resultado || '');
        
        const d = new Date(jogo.data_hora);
        const pad = (n) => n.toString().padStart(2, '0');
        setDataHora(`${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dia = dataHora.substring(0, 2);
            const mes = dataHora.substring(3, 5);
            const ano = dataHora.substring(6, 10);
            const hora = dataHora.substring(11, 13);
            const minuto = dataHora.substring(14, 16);
            const dataHoraISO = `${ano}-${mes}-${dia}T${hora}:${minuto}:00`;

            const dados = { 
                time_a: timeA, time_b: timeB, data_hora: dataHoraISO, 
                status, resultado: resultado || null 
            };

            if (editingId) {
                await api.patch(`/jogos/${editingId}/`, dados);
                setMensagem({ texto: '✅ Jogo atualizado com sucesso!', tipo: 'sucesso' });
            } else {
                await api.post('/jogos/', dados);
                setMensagem({ texto: '✅ Jogo criado com sucesso!', tipo: 'sucesso' });
            }

            setEditingId(null);
            setTimeA(''); setTimeB(''); setDataHora(''); setStatus('agendado'); setResultado('');
            carregarJogos();
        } catch (error) {
            setMensagem({ texto: '❌ Erro ao salvar dados.', tipo: 'erro' });
        } finally {
            setLoading(false);
        }
    };

    // 1. FILTROS DA LISTA DE JOGOS NO PAINEL ADMIN
    const jogosAgendados = jogos.filter(j => j.status === 'agendado');
    const jogosEmAndamento = jogos.filter(j => j.status === 'em_andamento');
    const jogosFinalizados = jogos.filter(j => j.status === 'finalizado');

    // Função interna para renderizar a linha de cada jogo de forma padronizada
    const renderItemJogo = (j) => {
        let textoResultado = '';
        if (j.resultado === 'vitoria_a') textoResultado = `| Vencedor: ${j.time_a}`;
        if (j.resultado === 'vitoria_b') textoResultado = `| Vencedor: ${j.time_b}`;
        if (j.resultado === 'empate') textoResultado = '| Empate';

        return (
            <div key={j.id} style={styles.listItem}>
                <div>
                    <span style={styles.matchText}><strong>{j.time_a} x {j.time_b}</strong></span><br/>
                    <small style={styles.matchDetails}>{j.data_hora} {textoResultado}</small>
                </div>
                <button onClick={() => handleEditClick(j)} style={styles.editButton}>Editar</button>
            </div>
        );
    };

    return (
        <div style={styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.navBrand}>Integra Bolão <span style={styles.adminTag}>Painel Admin</span></div>
                <button onClick={() => navigate('/dashboard')} style={styles.navButton}>Voltar aos Jogos</button>
            </nav>

            <main style={styles.container}>
                {/* FORMULÁRIO */}
                <div style={styles.card}>
                    <h2 style={styles.title}>{editingId ? '⚙️ Editar Jogo' : '➕ Novo Jogo'}</h2>
                    {mensagem.texto && <div style={mensagem.tipo === 'sucesso' ? styles.msgSucesso : styles.msgErro}>{mensagem.texto}</div>}
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.row}>
                            <div style={styles.inputGroup}><label style={styles.label}>Time A</label><input style={styles.input} value={timeA} onChange={e => setTimeA(e.target.value)} required /></div>
                            <div style={styles.inputGroup}><label style={styles.label}>Time B</label><input style={styles.input} value={timeB} onChange={e => setTimeB(e.target.value)} required /></div>
                        </div>
                        <div style={styles.inputGroup}><label style={styles.label}>Data/Hora (DD/MM/AAAA HH:MM)</label><input style={styles.input} value={dataHora} onChange={handleDataHoraChange} required maxLength={16} placeholder="DD/MM/AAAA HH:MM" /></div>
                        
                        <div style={styles.row}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Status</label>
                                <select style={styles.input} value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="agendado">Agendado</option>
                                    <option value="em_andamento">Em Andamento</option>
                                    <option value="finalizado">Finalizado</option>
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Vencedor (Resultado)</label>
                                <select style={styles.input} value={resultado} onChange={e => setResultado(e.target.value)}>
                                    <option value="">A definir</option>
                                    <option value="vitoria_a">Vitória {timeA || 'Time A'}</option>
                                    <option value="vitoria_b">Vitória {timeB || 'Time B'}</option>
                                    <option value="empate">Empate</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style={styles.row}>
                            <button type="submit" style={styles.button}>{loading ? 'Salvando...' : 'Salvar Jogo'}</button>
                            {editingId && <button type="button" onClick={() => {setEditingId(null); setTimeA(''); setTimeB(''); setDataHora(''); setStatus('agendado'); setResultado('');}} style={styles.cancelButton}>Cancelar</button>}
                        </div>
                    </form>
                </div>

                {/* LISTAGEM DE GERENCIAMENTO DIVIDIDA POR SEÇÃO */}
                <h2 style={styles.mainSectionTitle}>Gerenciar Jogos Existentes</h2>

                {/* Seção 1: Em Andamento */}
                <h3 style={styles.subSectionTitle}>⚽ Jogos em Andamento ({jogosEmAndamento.length})</h3>
                <div style={styles.list}>
                    {jogosEmAndamento.length > 0 ? jogosEmAndamento.map(renderItemJogo) : <p style={styles.emptyText}>Nenhum jogo em andamento no momento.</p>}
                </div>

                {/* Seção 2: Próximos Jogos */}
                <h3 style={styles.subSectionTitle}>📅 Próximos Jogos / Agendados ({jogosAgendados.length})</h3>
                <div style={styles.list}>
                    {jogosAgendados.length > 0 ? jogosAgendados.map(renderItemJogo) : <p style={styles.emptyText}>Nenhum jogo agendado disponível.</p>}
                </div>

                {/* Seção 3: Finalizados */}
                <h3 style={styles.subSectionTitle}>✅ Resultados / Finalizados ({jogosFinalizados.length})</h3>
                <div style={styles.list}>
                    {jogosFinalizados.length > 0 ? jogosFinalizados.map(renderItemJogo) : <p style={styles.emptyText}>Nenhum jogo finalizado ainda.</p>}
                </div>
            </main>
        </div>
    );
}

const styles = {
    page: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
    navbar: { backgroundColor: '#0f172a', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
    navBrand: { fontSize: '20px', fontWeight: 'bold' },
    adminTag: { backgroundColor: '#ef4444', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', marginLeft: '10px' },
    navButton: { background: 'none', border: '1px solid white', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    container: { maxWidth: '800px', margin: '40px auto', padding: '0 20px', paddingBottom: '60px' },
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    title: { color: '#0f172a', margin: '0 0 20px 0', fontSize: '22px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'flex', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
    label: { fontSize: '14px', color: '#475569', fontWeight: '600' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px' },
    button: { flex: 2, padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    cancelButton: { flex: 1, padding: '12px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    editButton: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    list: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '25px' },
    listItem: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #1e40af' },
    matchText: { fontSize: '16px', color: '#1e293b' },
    matchDetails: { color: '#64748b', fontSize: '14px' },
    mainSectionTitle: { color: '#0f172a', marginTop: '40px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' },
    subSectionTitle: { color: '#334155', fontSize: '18px', margin: '15px 0 10px 0', fontWeight: '600' },
    emptyText: { color: '#94a3b8', fontStyle: 'italic', padding: '10px 0', fontSize: '14px' },
    msgSucesso: { backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '15px' },
    msgErro: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '15px' }
};