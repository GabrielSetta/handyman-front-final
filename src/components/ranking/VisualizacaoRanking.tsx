import React, { useState, useEffect } from 'react';
import { URLAPI } from '../../constants/ApiUrl';
import { EstatisticasRanking, NivelRanking } from '../../types/rankingType';
import { toast } from 'react-toastify';

interface VisualizacaoRankingProps {
    id_usuario: string;
}

export const VisualizacaoRanking: React.FC<VisualizacaoRankingProps> = ({ id_usuario }) => {
    const [estatisticas, setEstatisticas] = useState<EstatisticasRanking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarEstatisticas();
    }, [id_usuario]);

    const carregarEstatisticas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${URLAPI}/ranking/estatisticas/${id_usuario}`);
            
            if (response.ok) {
                const data = await response.json();
                setEstatisticas(data);
            } else {
                toast.error('Erro ao carregar estatísticas');
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            toast.error('Erro ao carregar estatísticas');
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

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A75C00]"></div>
            </div>
        );
    }

    if (!estatisticas) {
        return (
            <div className="text-center p-8 text-gray-500">
                Nenhuma estatística disponível
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#8B4000] mb-6 text-center">
                Seu Ranking
            </h2>

            {/* Nível e Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-2">{getNivelIcon(estatisticas.nivel_atual)}</div>
                    <div className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${getNivelColor(estatisticas.nivel_atual)}`}>
                        {estatisticas.nivel_atual}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Nível Atual</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-[#A75C00] mb-2">
                        {estatisticas.score_atual}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                            className="bg-[#A75C00] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${estatisticas.score_atual}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600">Score: {estatisticas.score_atual}/100</p>
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
            {estatisticas.aspectos_positivos.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-700 mb-3">
                        ✅ Aspectos Mais Elogiados
                    </h3>
                    <div className="space-y-3">
                        {estatisticas.aspectos_positivos.map((aspecto, index) => (
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



            {/* Mensagem quando não há avaliações */}
            {estatisticas.total_avaliacoes === 0 && (
                <div className="text-center p-8 text-gray-500">
                    <div className="text-4xl mb-4">📊</div>
                    <p>Você ainda não recebeu avaliações.</p>
                    <p className="text-sm">Complete serviços para começar a construir seu ranking!</p>
                </div>
            )}

            {/* Informações sobre níveis */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-[#8B4000] mb-2">Como funciona o ranking?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Bronze:</strong> 0-49 pontos</li>
                    <li>• <strong>Prata:</strong> 50-69 pontos</li>
                    <li>• <strong>Ouro:</strong> 70-79 pontos</li>
                    <li>• <strong>Platina:</strong> 80-89 pontos</li>
                    <li>• <strong>Diamante:</strong> 90-100 pontos</li>
                </ul>
            </div>
        </div>
    );
}; 