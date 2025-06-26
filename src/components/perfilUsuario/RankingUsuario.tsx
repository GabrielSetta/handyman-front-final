import React, { useState, useEffect } from 'react';
import { URLAPI } from '../../constants/ApiUrl';
import { EstatisticasRanking, NivelRanking } from '../../types/rankingType';
import { toast } from 'react-toastify';

interface RankingUsuarioProps {
    id_usuario: string;
}

export const RankingUsuario: React.FC<RankingUsuarioProps> = ({ id_usuario }) => {
    const [estatisticas, setEstatisticas] = useState<EstatisticasRanking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarRanking();
    }, [id_usuario]);

    const carregarRanking = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${URLAPI}/ranking/usuario/${id_usuario}`);
            
            if (response.ok) {
                const data = await response.json();
                setEstatisticas(data);
            } else {
                console.error('Erro ao carregar ranking');
            }
        } catch (error) {
            console.error('Erro ao carregar ranking:', error);
        } finally {
            setLoading(false);
        }
    };

    const getNivelColor = (nivel: NivelRanking) => {
        switch (nivel) {
            case NivelRanking.BRONZE:
                return 'text-amber-600 bg-amber-100';
            case NivelRanking.PRATA:
                return 'text-gray-600 bg-gray-100';
            case NivelRanking.OURO:
                return 'text-yellow-600 bg-yellow-100';
            case NivelRanking.PLATINA:
                return 'text-cyan-600 bg-cyan-100';
            case NivelRanking.DIAMANTE:
                return 'text-purple-600 bg-purple-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getNivelIcon = (nivel: NivelRanking) => {
        switch (nivel) {
            case NivelRanking.BRONZE:
                return '🥉';
            case NivelRanking.PRATA:
                return '🥈';
            case NivelRanking.OURO:
                return '🥇';
            case NivelRanking.PLATINA:
                return '💎';
            case NivelRanking.DIAMANTE:
                return '💎';
            default:
                return '🏆';
        }
    };

    // Adaptação para aceitar ambos os formatos de resposta
    const nivel = estatisticas?.nivel_atual || (estatisticas as any)?.nivel || '';
    const score =
        estatisticas?.score_atual !== undefined ? estatisticas.score_atual :
        (estatisticas as any)?.score !== undefined ? (estatisticas as any).score : '';

    // Definição dos níveis e cortes (ajustado)
    const niveis = [
        { nome: 'Bronze', cor: 'bg-amber-600', corte: 0, texto: 'text-amber-600', icone: '🥉' },
        { nome: 'Prata', cor: 'bg-gray-400', corte: 30, texto: 'text-gray-600', icone: '🥈' },
        { nome: 'Ouro', cor: 'bg-yellow-400', corte: 60, texto: 'text-yellow-600', icone: '🥇' },
        { nome: 'Platina', cor: 'bg-cyan-400', corte: 80, texto: 'text-cyan-600', icone: '💎' },
        { nome: 'Diamante', cor: 'bg-purple-600', corte: 90, texto: 'text-purple-600', icone: '💎' },
    ];

    // Função para pegar cor da barra conforme o nível
    const getBarColor = (nivel: string) => {
        const n = niveis.find(n => n.nome === nivel);
        return n ? n.cor : 'bg-amber-600';
    };

    // Função para pegar cor do texto do checkpoint
    const getCheckpointText = (nivel: string) => {
        const n = niveis.find(n => n.nome === nivel);
        return n ? n.texto : 'text-amber-600';
    };

    // Função para pegar cor do texto do score
    const getScoreTextColor = (nivel: string) => {
        const n = niveis.find(n => n.nome === nivel);
        return n ? n.texto : 'text-amber-600';
    };

    // Função para pegar cor de fundo do segmento
    const getSegmentColor = (idx: number) => niveis[idx].cor;

    // Calcular larguras dos segmentos
    const segmentos = niveis.map((n, idx) => {
        const nextCorte = niveis[idx + 1]?.corte ?? 100;
        const largura = nextCorte - n.corte;
        return { ...n, largura };
    });

    // Calcular quanto preencher em cada segmento
    let scoreRestante = score;
    const preenchimentos = segmentos.map((seg, idx) => {
        if (scoreRestante <= 0) return 0;
        const preenchido = Math.min(seg.largura, scoreRestante);
        scoreRestante -= preenchido;
        return preenchido;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A75C00]"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#8B4000] mb-2">
                        Meu Ranking
                    </h1>
                    <p className="text-gray-600">
                        Acompanhe seu progresso e pontuação no sistema
                    </p>
                </div>

                {/* Visualização do Ranking */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#8B4000] mb-4 text-center">
                        Seu Ranking Atual
                    </h2>
                    
                    {estatisticas ? (
                        <>
                            {/* Nível e Score */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-4xl mb-2">{getNivelIcon(nivel)}</div>
                                    <div className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${getNivelColor(nivel)}`}>
                                        {nivel}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">Nível Atual</p>
                                </div>

                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className={`text-4xl font-bold mb-2 ${getScoreTextColor(nivel)}`}>{score}</div>
                                    {/* Checkpoints */}
                                    <div className="flex justify-between mb-1 px-1 relative" style={{height: '18px'}}>
                                        {niveis.map((n, idx) => (
                                            <span
                                                key={n.nome}
                                                className={`text-xs font-semibold ${getCheckpointText(n.nome)}`}
                                                style={{
                                                    position: 'absolute',
                                                    left: idx === 0
                                                        ? '0'
                                                        : idx === niveis.length - 1
                                                            ? 'unset'
                                                            : `calc(${n.corte}% - 18px)`,
                                                    right: idx === niveis.length - 1 ? '0' : 'unset',
                                                    minWidth: idx === 0 || idx === niveis.length - 1 ? '36px' : '36px',
                                                    textAlign: idx === 0 ? 'left' : idx === niveis.length - 1 ? 'right' : 'center',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'visible',
                                                }}
                                            >
                                                {n.nome}
                                            </span>
                                        ))}
                                    </div>
                                    {/* Barra de progresso única com checkpoints */}
                                    <div className="relative w-full h-4 mb-1 bg-gray-200 rounded-full">
                                        {/* Barra preenchida */}
                                        <div
                                            className={`absolute left-0 top-0 h-4 rounded-full transition-all duration-300 ${getBarColor(nivel)}`}
                                            style={{ width: `${score}%`, zIndex: 1 }}
                                        ></div>
                                        {/* Checkpoints visuais */}
                                        {niveis.map((n, idx) => (
                                            <div
                                                key={n.nome}
                                                className="absolute top-0 h-4 w-1 bg-white border-l-2 border-gray-400"
                                                style={{ left: `calc(${n.corte}% - 1px)`, zIndex: 2 }}
                                            ></div>
                                        ))}
                                    </div>
                                    {/* Pontuação dos cortes */}
                                    <div className="relative w-full flex justify-between px-1" style={{marginTop: '-2px'}}>
                                        {[...niveis.map((n) => n.corte), 100].map((corte, idx) => (
                                            <span
                                                key={corte + '-score'}
                                                className="text-xs text-gray-500"
                                                style={{
                                                    position: 'absolute',
                                                    left: `calc(${corte}% - 10px)`, // centraliza o número
                                                    minWidth: '20px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {corte}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">Score: {score}/100</p>
                                </div>
                            </div>

                            {/* Estatísticas Gerais */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-[#8B4000] mb-3">
                                    Estatísticas Gerais
                                </h3>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-center text-blue-800">
                                        <span className="font-bold">{estatisticas.total_avaliacoes}</span> avaliações recebidas
                                    </p>
                                </div>
                            </div>

                            {/* Aspectos Positivos */}
                            {estatisticas?.aspectos_positivos?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-green-700 mb-3">
                                        ✅ Aspectos Mais Elogiados
                                    </h3>
                                    <div className="space-y-3">
                                        {(estatisticas.aspectos_positivos || []).map((aspecto, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <span className="text-sm text-green-800">{aspecto.aspecto}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-20 bg-green-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{ width: `${aspecto.percentual}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-green-700">
                                                        {aspecto.percentual}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Aspectos Negativos */}
                            {estatisticas?.aspectos_negativos?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-red-700 mb-3">
                                        ❌ Aspectos Mais Criticados
                                    </h3>
                                    <div className="space-y-3">
                                        {(estatisticas.aspectos_negativos || []).map((aspecto, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                                <span className="text-sm text-red-800">{aspecto.aspecto}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-20 bg-red-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-red-500 h-2 rounded-full"
                                                            style={{ width: `${aspecto.percentual}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-red-700">
                                                        {aspecto.percentual}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mensagem quando não há avaliações */}
                            {estatisticas.total_avaliacoes === 0 && (
                                <div className="text-center p-8 text-gray-500">
                                    <div className="text-4xl mb-4">📊</div>
                                    <p>Você ainda não recebeu avaliações.</p>
                                    <p className="text-sm">Complete serviços para começar a construir seu ranking!</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            <div className="text-4xl mb-4">📊</div>
                            <p>Não foi possível carregar seu ranking.</p>
                        </div>
                    )}
                </div>

                {/* Explicação do Sistema */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-[#8B4000] mb-4">
                        Como Funciona o Sistema de Ranking
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-blue-800 mb-2">Níveis de Ranking</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• <strong>Bronze:</strong> 0-29 pontos</li>
                                <li>• <strong>Prata:</strong> 30-59 pontos</li>
                                <li>• <strong>Ouro:</strong> 60-79 pontos</li>
                                <li>• <strong>Platina:</strong> 80-89 pontos</li>
                                <li>• <strong>Diamante:</strong> 90-100 pontos</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-green-800 mb-2">Aspectos Avaliados</h3>
                            <div className="text-sm text-gray-600">
                                <p className="font-medium text-green-700 mb-1">Positivos:</p>
                                <ul className="space-y-1 mb-3">
                                    <li>• Ajudou no processo</li>
                                    <li>• Foi educado</li>
                                    <li>• Pagamento pontual</li>
                                    <li>• Comunicação clara</li>
                                </ul>
                                
                                <p className="font-medium text-red-700 mb-1">Negativos:</p>
                                <ul className="space-y-1">
                                    <li>• Pagamento atrasado</li>
                                    <li>• Comunicação ruim</li>
                                    <li>• Cancelou sem motivo</li>
                                    <li>• Desrespeitou horário</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 