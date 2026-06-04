import { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

// Matriz estática de times para alimentar os seletores do formulário sem depender do Back-end
const LISTA_TIMES_COPA = [
    "Africa do Sul", "Alemanha", "Arabia Saudita", "Argelia", "Argentina", 
    "Australia", "Austria", "Belgica", "Bosnia e Herzegovina", "Brasil", 
    "Cabo Verde", "Canada (Pais-sede)", "Catar", "Colombia", "Coreia do Sul", 
    "Costa do Marfim", "Croacia", "Curacau", "Egito", "Equador", "Escocia", 
    "Espanha", "Estados Unidos (Pais-sede)", "Franca", "Gana", "Haiti", 
    "Holanda", "Inglaterra", "Ira", "Iraque", "Japao", "Jordania", 
    "Marrocos", "Mexico (Pais-sede)", "Noruega", "Nova Zelandia", "Panama", 
    "Paraguai", "Portugal", "RD Congo", "Republica Tcheca", "Senegal", 
    "Suecia", "Suica", "Tunisia", "Turquia", "Uruguai", "Uzbequistao"
];

export default function AdminJogos() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [timeA, setTimeA] = useState('');
    const [timeB, setTimeB] = useState('');
    
    // Estados separados para Data e Hora
    const [dataJogo, setDataJogo] = useState('');
    const [horaJogo, setHoraJogo] = useState('');
    
    const [status, setStatus] = useState('agendado');
    const [resultado, setResultado] = useState('');
    
    const [jogos, setJogos] = useState([]);
    
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    // Estados para Importação em Lote via JSON
    const [jsonImport, setJsonImport] = useState('');
    const [showImportArea, setShowImportArea] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            // Busca apenas os jogos (dependência de times foi removida da API)
            const resJogos = await api.get('/jogos/');
            setJogos(resJogos.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
            setMensagem({ texto: '⚠️ Aviso: Não foi possível carregar os jogos.', tipo: 'erro' });
        }
    };

    if (!user?.is_staff) return <Navigate to="/dashboard" />;

    // Máscaras de entrada
    const handleDataChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 8) val = val.substring(0, 8);
        if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
        if (val.length > 5) val = val.substring(0, 5) + '/' + val.substring(5);
        setDataJogo(val);
    };

    const handleHoraChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.substring(0, 4);
        if (val.length > 2) val = val.substring(0, 2) + ':' + val.substring(2);
        setHoraJogo(val);
    };

    const handleEditClick = (jogo) => {
        setEditingId(jogo.id);
        setTimeA(jogo.time_a);
        setTimeB(jogo.time_b);
        setStatus(jogo.status);
        setResultado(jogo.resultado || '');
        
        const d = new Date(jogo.data_hora);
        const pad = (n) => n.toString().padStart(2, '0');
        
        setDataJogo(`${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`);
        setHoraJogo(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm("⚠️ TEM A CERTEZA que deseja excluir este jogo? Esta ação não pode ser desfeita e removerá todos os palpites associados a ele.")) {
            return;
        }

        try {
            await api.delete(`/jogos/${id}/`);
            setMensagem({ texto: '✅ Jogo excluído com sucesso!', tipo: 'sucesso' });
            
            if (editingId === id) {
                setEditingId(null); setTimeA(''); setTimeB(''); setDataJogo(''); setHoraJogo(''); setStatus('agendado'); setResultado('');
            }
            
            carregarDados();
        } catch (error) {
            console.error("Erro ao deletar jogo:", error);
            setMensagem({ texto: '❌ Erro ao excluir o jogo.', tipo: 'erro' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: '', tipo: '' });
        
        if (timeA === timeB) {
            setMensagem({ texto: '❌ O Time A e o Time B não podem ser o mesmo!', tipo: 'erro' });
            return;
        }

        if (dataJogo.length !== 10 || horaJogo.length !== 5) {
            setMensagem({ texto: '❌ Preencha a data e hora completamente.', tipo: 'erro' });
            return;
        }

        setLoading(true);
        try {
            const dia = dataJogo.substring(0, 2);
            const mes = dataJogo.substring(3, 5);
            const ano = dataJogo.substring(6, 10);
            const hora = horaJogo.substring(0, 2);
            const minuto = horaJogo.substring(3, 5);
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

            setEditingId(null); setTimeA(''); setTimeB(''); setDataJogo(''); setHoraJogo(''); setStatus('agendado'); setResultado('');
            carregarDados();
        } catch (error) {
            setMensagem({ texto: '❌ Erro ao salvar dados.', tipo: 'erro' });
        } finally {
            setLoading(false);
        }
    };

    const handleImportarLote = async () => {
        try {
            const payload = JSON.parse(jsonImport);
            if (!Array.isArray(payload)) {
                alert("O formato precisa de ser uma lista [ ] de objetos.");
                return;
            }

            setLoading(true);
            
            // 1. Pega a lista atualizada de jogos do servidor para comparar
            const resJogos = await api.get('/jogos/');
            const jogosExistentes = resJogos.data;

            // 2. Prepara as requisições (POST para novos, PATCH para existentes)
            const promises = payload.map(item => {
                // Procura se já existe um jogo com estes exatos dois times
                const jogoExistente = jogosExistentes.find(
                    j => j.time_a === item.time_a && j.time_b === item.time_b
                );
                
                if (jogoExistente) {
                    // SE EXISTE: Envia um PATCH para atualizar o status e o vencedor
                    return api.patch(`/jogos/${jogoExistente.id}/`, {
                        // Mantém a data antiga se não enviar uma nova
                        data_hora: item.data_hora || jogoExistente.data_hora, 
                        status: item.status || 'finalizado',
                        resultado: item.resultado || null
                    });
                } else {
                    // SE NÃO EXISTE: Envia um POST para criar um novo jogo
                    return api.post('/jogos/', {
                        time_a: item.time_a,
                        time_b: item.time_b,
                        data_hora: item.data_hora,
                        status: item.status || 'agendado',
                        resultado: item.resultado || null
                    });
                }
            });

            // Dispara todas as atualizações de uma só vez
            await Promise.all(promises);

            setMensagem({ texto: `🎉 ${payload.length} operações em lote processadas com sucesso!`, tipo: 'sucesso' });
            setJsonImport('');
            setShowImportArea(false);
            carregarDados();
        } catch (error) {
            alert("Erro ao processar o JSON. Verifique a formatação dos campos.");
        } finally {
            setLoading(false);
        }
    };

    const jogosAgendados = jogos.filter(j => j.status === 'agendado');
    const jogosEmAndamento = jogos.filter(j => j.status === 'em_andamento');
    const jogosFinalizados = jogos.filter(j => j.status === 'finalizado');

    const renderItemJogo = (j) => {
        let textoResultado = '';
        if (j.resultado === 'vitoria_a') textoResultado = `| Vencedor: ${j.time_a}`;
        if (j.resultado === 'vitoria_b') textoResultado = `| Vencedor: ${j.time_b}`;
        if (j.resultado === 'empate') textoResultado = '| Empate';

        return (
            <div key={j.id} style={styles.listItem}>
                <div style={{ flex: 1 }}>
                    <span style={styles.matchText}><strong>{j.time_a} x {j.time_b}</strong></span><br/>
                    <small style={styles.matchDetails}>{new Date(j.data_hora).toLocaleString('pt-BR').slice(0, 16)} {textoResultado}</small>
                </div>
                
                <div style={styles.actionButtons}>
                    <button onClick={() => handleEditClick(j)} style={styles.editButton}>Editar</button>
                    <button onClick={() => handleDeleteClick(j.id)} style={styles.deleteButton}>Excluir</button>
                </div>
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
                
                <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                    <button 
                        type="button" 
                        onClick={() => setShowImportArea(!showImportArea)} 
                        style={{ ...styles.button, backgroundColor: '#475569', padding: '8px 15px', fontSize: '14px' }}
                    >
                        {showImportArea ? '🔼 Fechar Importador' : '🚀 Importação em Lote (JSON)'}
                    </button>
                </div>

                {showImportArea && (
                    <div style={{ ...styles.card, marginBottom: '30px', borderTop: '4px solid #475569' }}>
                        <h3 style={{...styles.title, marginBottom: '5px'}}>Módulo de Importação Rápida</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                            Cole a lista estruturada de jogos abaixo para inserção imediata em lote.
                        </p>
                        <textarea 
                            style={{ ...styles.input, width: '96%', height: '150px', fontFamily: 'monospace', fontSize: '13px', resize: 'vertical' }} 
                            value={jsonImport}
                            onChange={e => setJsonImport(e.target.value)}
                            placeholder={'[\n  { "time_a": "Brasil", "time_b": "Marrocos", "data_hora": "2026-06-13T13:00:00" }\n]'}
                        />
                        <button 
                            type="button" 
                            onClick={handleImportarLote} 
                            disabled={!jsonImport || loading} 
                            style={{ ...styles.button, marginTop: '15px', width: '100%' }}
                        >
                            {loading ? 'Processando Carga...' : 'Executar Carga de Dados'}
                        </button>
                    </div>
                )}

                <div style={styles.card}>
                    <h2 style={styles.title}>{editingId ? '⚙️ Editar Jogo' : '➕ Novo Jogo (Manual)'}</h2>
                    {mensagem.texto && <div style={mensagem.tipo === 'sucesso' ? styles.msgSucesso : styles.msgErro}>{mensagem.texto}</div>}
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        
                        <div style={styles.row}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Time A (Mandante)</label>
                                <select style={styles.input} value={timeA} onChange={e => setTimeA(e.target.value)} required>
                                    <option value="" disabled>Selecione o time...</option>
                                    {LISTA_TIMES_COPA.map(time => <option key={`timeA_${time}`} value={time}>{time}</option>)}
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Time B (Visitante)</label>
                                <select style={styles.input} value={timeB} onChange={e => setTimeB(e.target.value)} required>
                                    <option value="" disabled>Selecione o time...</option>
                                    {LISTA_TIMES_COPA.map(time => <option key={`timeB_${time}`} value={time}>{time}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Data da Partida</label>
                                <input style={styles.input} value={dataJogo} onChange={handleDataChange} required maxLength={10} placeholder="DD/MM/AAAA" />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Hora de Brasília</label>
                                <input style={styles.input} value={horaJogo} onChange={handleHoraChange} required maxLength={5} placeholder="HH:MM" />
                            </div>
                        </div>
                        
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
                            {editingId && <button type="button" onClick={() => {setEditingId(null); setTimeA(''); setTimeB(''); setDataJogo(''); setHoraJogo(''); setStatus('agendado'); setResultado('');}} style={styles.cancelButton}>Cancelar</button>}
                        </div>
                    </form>
                </div>

                <h2 style={styles.mainSectionTitle}>Gerenciar Jogos Existentes</h2>
                
                <h3 style={styles.subSectionTitle}>⚽ Jogos em Andamento ({jogosEmAndamento.length})</h3>
                <div style={styles.list}>
                    {jogosEmAndamento.length > 0 ? jogosEmAndamento.map(renderItemJogo) : <p style={styles.emptyText}>Nenhum jogo em andamento no momento.</p>}
                </div>

                <h3 style={styles.subSectionTitle}>📅 Próximos Jogos ({jogosAgendados.length})</h3>
                <div style={styles.list}>
                    {jogosAgendados.length > 0 ? jogosAgendados.map(renderItemJogo) : <p style={styles.emptyText}>Nenhum jogo agendado disponível.</p>}
                </div>

                <h3 style={styles.subSectionTitle}>✅ Finalizados ({jogosFinalizados.length})</h3>
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
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderTop: '4px solid #1e40af' },
    title: { color: '#0f172a', margin: '0 0 20px 0', fontSize: '22px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'flex', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
    label: { fontSize: '14px', color: '#475569', fontWeight: '600' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px' },
    button: { flex: 2, padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    cancelButton: { flex: 1, padding: '12px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    list: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', marginBottom: '25px' },
    listItem: { backgroundColor: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #1e40af' },
    matchText: { fontSize: '16px', color: '#1e293b' },
    matchDetails: { color: '#64748b', fontSize: '14px' },
    actionButtons: { display: 'flex', gap: '8px' },
    editButton: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
    deleteButton: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
    mainSectionTitle: { color: '#0f172a', marginTop: '40px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' },
    subSectionTitle: { color: '#334155', fontSize: '18px', margin: '15px 0 10px 0', fontWeight: '600' },
    emptyText: { color: '#94a3b8', fontStyle: 'italic', padding: '10px 0', fontSize: '14px' },
    msgSucesso: { backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '15px' },
    msgErro: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '15px' }
};