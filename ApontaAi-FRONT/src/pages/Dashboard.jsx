import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Estados dos dados
    const [jogos, setJogos] = useState([]);
    const [palpites, setPalpites] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [loadingInfo, setLoadingInfo] = useState('');
    
    // Controle da Barra Lateral de Ranking
    const [isRankingOpen, setIsRankingOpen] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [resJogos, resPalpites, resRanking] = await Promise.all([
                api.get('/jogos/'),
                api.get('/palpites/'),
                api.get('/usuarios/')
            ]);
            
            setJogos(resJogos.data);
            setPalpites(resPalpites.data);
            
            // 1. Filtra removendo os administradores (!u.is_staff)
            // 2. Ordena os usuários normais pela pontuação (do maior pro menor)
            const rankeados = resRanking.data
                .filter(u => !u.is_staff) 
                .sort((a, b) => b.pontuacao_total - a.pontuacao_total);
                
            setRanking(rankeados);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    };

    // Salva ou atualiza um palpite
    const salvarPalpite = async (jogoId, escolha, palpiteId = null) => {
        setLoadingInfo('Processando palpite...');
        try {
            if (palpiteId) {
                // Atualiza o palpite existente
                await api.patch(`/palpites/${palpiteId}/`, { escolha });
            } else {
                // Cria um novo palpite
                await api.post('/palpites/', { jogo: jogoId, escolha });
            }
            await carregarDados(); // Recarrega os dados para atualizar a tela
        } catch (error) {
            alert(error.response?.data?.non_field_errors || "Erro ao processar palpite.");
        } finally {
            setLoadingInfo('');
        }
    };

    const formatarEscolha = (escolha) => {
        if (escolha === 'vitoria_a') return 'Vitória Time A';
        if (escolha === 'vitoria_b') return 'Vitória Time B';
        if (escolha === 'empate') return 'Empate';
        return '';
    };

    // Separa os jogos em duas listas
    const jogosAbertos = jogos.filter(jogo => jogo.status !== 'finalizado');
    const jogosFinalizados = jogos.filter(jogo => jogo.status === 'finalizado');

    // Função que desenha o "card" (cartão) de cada jogo
    const renderizarCardJogo = (jogo) => {
        const meuPalpite = palpites.find(p => p.jogo === jogo.id);

        return (
            <div key={jogo.id} style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.date}>{jogo.data_hora}</span>
                    <span style={jogo.status === 'agendado' ? styles.badgeAgendado : styles.badgeFinalizado}>
                        {jogo.status.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
                
                <div style={styles.matchup}>
                    <span style={styles.team}>{jogo.time_a}</span>
                    <span style={styles.vs}>X</span>
                    <span style={styles.team}>{jogo.time_b}</span>
                </div>

                {/* Área interativa: O jogo está aberto, permitindo criar ou mudar o palpite */}
                {jogo.status === 'agendado' && (
                    <div style={styles.actionArea}>
                        <button 
                            onClick={() => salvarPalpite(jogo.id, 'vitoria_a', meuPalpite?.id)} 
                            style={meuPalpite?.escolha === 'vitoria_a' ? styles.betButtonActive : styles.betButton}
                        >
                            Vitória {jogo.time_a}
                        </button>
                        <button 
                            onClick={() => salvarPalpite(jogo.id, 'empate', meuPalpite?.id)} 
                            style={meuPalpite?.escolha === 'empate' ? styles.betButtonActive : styles.betButton}
                        >
                            Empate
                        </button>
                        <button 
                            onClick={() => salvarPalpite(jogo.id, 'vitoria_b', meuPalpite?.id)} 
                            style={meuPalpite?.escolha === 'vitoria_b' ? styles.betButtonActive : styles.betButton}
                        >
                            Vitória {jogo.time_b}
                        </button>
                    </div>
                )}

                {/* Área bloqueada: O jogo começou ou terminou, mostrando o resultado */}
                {jogo.status !== 'agendado' && (
                    <div style={styles.myBetArea}>
                        {meuPalpite ? (
                            <>
                                <p style={styles.myBetText}>Seu palpite foi: <strong>{formatarEscolha(meuPalpite.escolha)}</strong></p>
                                {jogo.status === 'finalizado' && (
                                    <div style={meuPalpite.pontuou ? styles.resultWin : styles.resultLoss}>
                                        {meuPalpite.pontuou ? '🎉 Você acertou! (+10 pts)' : '❌ Não foi dessa vez.'}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p style={{...styles.myBetText, color: '#94a3b8'}}>Você não deixou palpite para este jogo.</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={styles.page}>
            {/* OVERLAY ESCURO DO RANKING */}
            {isRankingOpen && <div style={styles.overlay} onClick={() => setIsRankingOpen(false)}></div>}

            {/* SIDEBAR DO RANKING */}
            <div style={{...styles.sidebar, transform: isRankingOpen ? 'translateX(0)' : 'translateX(100%)'}}>
                <div style={styles.sidebarHeader}>
                    <h2 style={styles.sidebarTitle}>🏆 Ranking Geral</h2>
                    <button onClick={() => setIsRankingOpen(false)} style={styles.closeButton}>✕</button>
                </div>
                <div style={styles.sidebarContent}>
                    {ranking.map((u, index) => (
                        <div key={u.id} style={styles.rankingItem}>
                            <div style={styles.rankingPosicao}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                            </div>
                            
                            {/* NOVO: Renderiza a foto de perfil de cada competidor no ranking */}
                            <img 
                                src={u.foto_perfil || 'https://via.placeholder.com/32'} 
                                style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px', border: '1px solid #cbd5e1'}}
                                alt="Avatar Competidor"
                            />

                            <div style={styles.rankingNome}>
                                <strong>{u.username}</strong>
                                {u.username === user?.username && <span style={styles.voceTag}>Você</span>}
                            </div>
                            <div style={styles.rankingPoints}>{u.pontuacao_total} pts</div>
                        </div>
                    ))}
                </div>
            </div>

            <nav style={styles.navbar}>
                <div style={styles.navBrand}>Integra Bolão</div>
                <div style={styles.navLinks}>
                    {/* Atalho clicável para o perfil pessoal */}
                    <div onClick={() => navigate('/perfil')} style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                        <img 
                            src={user?.foto_perfil || 'https://via.placeholder.com/32'} 
                            style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white'}}
                            alt="Avatar"
                        />
                        <span style={styles.userBadge}>Olá, {user?.username} ({user?.pontuacao_total} pts)</span>
                    </div>
                    
                    {user?.is_staff && (
                        <button onClick={() => navigate('/admin-jogos')} style={{...styles.navButton, backgroundColor: '#0f172a', border: 'none'}}>
                            ⚙️ Admin
                        </button>
                    )}

                    <button onClick={() => setIsRankingOpen(true)} style={styles.navButton}>🏆 Ranking</button>
                    <button onClick={logout} style={styles.logoutButton}>Sair</button>
                </div>
            </nav>

            {/* ÁREA DE JOGOS */}
            <main style={styles.container}>
                {loadingInfo && <div style={styles.loadingBanner}>{loadingInfo}</div>}

                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>📅 Próximos Jogos</h2>
                    <p style={styles.sectionSubtitle}>Você pode alterar seus palpites livremente até o início da partida</p>
                </div>
                
                {jogosAbertos.length > 0 ? (
                    <div style={styles.grid}>{jogosAbertos.map(renderizarCardJogo)}</div>
                ) : (
                    <p style={styles.emptyText}>Nenhum jogo em aberto no momento.</p>
                )}

                <hr style={styles.divider} />

                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>✅ Resultados Anteriores</h2>
                    <p style={styles.sectionSubtitle}>Confira suas pontuações passadas</p>
                </div>

                {jogosFinalizados.length > 0 ? (
                    <div style={styles.grid}>{jogosFinalizados.map(renderizarCardJogo)}</div>
                ) : (
                    <p style={styles.emptyText}>Nenhum jogo foi finalizado ainda.</p>
                )}
            </main>
        </div>
    );
}

// ESTILOS GERAIS DA PÁGINA
const styles = {
    page: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' },
    navbar: { backgroundColor: '#1e40af', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
    navBrand: { fontSize: '20px', fontWeight: 'bold' },
    navLinks: { display: 'flex', gap: '15px', alignItems: 'center' },
    userBadge: { backgroundColor: '#3b82f6', padding: '5px 12px', borderRadius: '20px', fontSize: '14px' },
    navButton: { backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    logoutButton: { backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 999 },
    sidebar: { position: 'fixed', top: 0, right: 0, width: '350px', height: '100vh', backgroundColor: '#ffffff', boxShadow: '-5px 0 25px rgba(0,0,0,0.15)', zIndex: 1000, transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column' },
    sidebarHeader: { backgroundColor: '#1e40af', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    sidebarTitle: { margin: 0, fontSize: '20px' },
    closeButton: { background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' },
    sidebarContent: { padding: '0 20px', overflowY: 'auto', flex: 1 },
    rankingItem: { display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #e2e8f0' },
    rankingPosicao: { width: '40px', fontSize: '18px', fontWeight: 'bold', color: '#1e40af' },
    rankingNome: { flex: 1, color: '#334155', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    voceTag: { backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' },
    rankingPoints: { fontWeight: 'bold', color: '#10b981', fontSize: '16px' },
    loadingBanner: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '10px', textAlign: 'center', borderRadius: '6px', marginBottom: '20px', fontWeight: '500' },
    sectionHeader: { marginBottom: '20px' },
    sectionTitle: { color: '#0f172a', margin: '0 0 5px 0', fontSize: '24px' },
    sectionSubtitle: { color: '#64748b', margin: '0', fontSize: '14px' },
    divider: { border: 'none', borderTop: '1px solid #cbd5e1', margin: '40px 0' },
    emptyText: { color: '#94a3b8', fontStyle: 'italic', padding: '20px', backgroundColor: 'white', borderRadius: '8px', textAlign: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: '4px solid #1e40af' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' },
    date: { color: '#64748b', fontSize: '14px' },
    badgeAgendado: { backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    badgeFinalizado: { backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    matchup: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' },
    team: { flex: 1, textAlign: 'center' },
    vs: { color: '#94a3b8', fontSize: '14px' },
    actionArea: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' },
    betButton: { padding: '10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#334155', transition: '0.2s' },
    betButtonActive: { padding: '10px', backgroundColor: '#1e40af', border: '1px solid #1e40af', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#ffffff', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.3)' },
    myBetArea: { marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '6px', textAlign: 'center' },
    myBetText: { margin: '0', color: '#475569' },
    resultWin: { marginTop: '10px', color: '#15803d', fontWeight: 'bold', backgroundColor: '#dcfce7', padding: '8px', borderRadius: '4px' },
    resultLoss: { marginTop: '10px', color: '#b91c1c', fontWeight: 'bold', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '4px' }
};