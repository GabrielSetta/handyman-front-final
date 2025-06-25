import React, { useState, useEffect } from 'react';
import { URLAPI } from '../../constants/ApiUrl';
import { toast } from 'react-toastify';

interface PreviewRankingUsuarioProps {
    id_usuario: string;
    onClose: () => void;
}

interface RankingData {
    nivel: string;
    score: number;
    total_avaliacoes: number;
    aspectos_negativos: Array<{
        aspecto: string;
        percentual: number;
    }>;
}

export const PreviewRankingUsuario: React.FC<PreviewRankingUsuarioProps> = ({
    id_usuario,
    onClose
}) => {
    const [ranking, setRanking] = useState<RankingData | null>(null);
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
                setRanking(data);
            } else {
                toast.error('Erro ao carregar ranking do usuário');
            }
        } catch (error) {
            console.error('Erro ao carregar ranking:', error);
            toast.error('Erro ao carregar ranking do usuário');
        } finally {
            setLoading(false);
        }
    };

    const getNivelColor = (nivel: string) => {
        switch (nivel) {
            case 'Bronze':
                return 'text-amber-600 bg-amber-100';
            case 'Prata':
                return 'text-gray-600 bg-gray-100';
            case 'Ouro':
                return 'text-yellow-600 bg-yellow-100';
            case 'Platina':
                return 'text-cyan-600 bg-cyan-100';
            case 'Diamante':
                return 'text-purple-600 bg-purple-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getNivelIcon = (nivel: string) => {
        switch (nivel) {
            case 'Bronze':
                return '🥉';
            case 'Prata':
                return '🥈';
            case 'Ouro':
                return '🥇';
            case 'Platina':
                return '💎';
            case 'Diamante':
                return '💎';
            default:
                return '🏆';
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A75C00]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#8B4000]">
                        Ranking do Cliente
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {ranking ? (
                    <div className="space-y-4">
                        {/* Nível e Score */}
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-3xl mb-2">{getNivelIcon(ranking.nivel)}</div>
                            <div className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${getNivelColor(ranking.nivel)}`}>
                                {ranking.nivel}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Score: {ranking.score}/100
                            </p>
                        </div>

                        {/* Total de Avaliações */}
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <p className="text-blue-800">
                                <span className="font-bold">{ranking.total_avaliacoes}</span> avaliações recebidas
                            </p>
                        </div>

                        {/* Aspectos Negativos */}
                        {ranking.aspectos_negativos.length > 0 ? (
                            <div>
                                <h3 className="text-lg font-semibold text-red-700 mb-3">
                                    ⚠️ Aspectos Negativos
                                </h3>
                                <div className="space-y-2">
                                    {ranking.aspectos_negativos.map((aspecto, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                                            <span className="text-sm text-red-800">{aspecto.aspecto}</span>
                                            <span className="text-sm font-medium text-red-700">
                                                {aspecto.percentual}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-green-800">
                                    ✅ Nenhum aspecto negativo registrado
                                </p>
                            </div>
                        )}

                        {/* Recomendação */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-[#8B4000] mb-2">Recomendação</h4>
                            {ranking.score >= 70 ? (
                                <p className="text-green-700 text-sm">
                                    ✅ Cliente com boa reputação. Recomendado para aceitar o pedido.
                                </p>
                            ) : ranking.score >= 50 ? (
                                <p className="text-yellow-700 text-sm">
                                    ⚠️ Cliente com reputação moderada. Avalie com cuidado.
                                </p>
                            ) : (
                                <p className="text-red-700 text-sm">
                                    ❌ Cliente com baixa reputação. Considere recusar o pedido.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8 text-gray-500">
                        <div className="text-4xl mb-4">📊</div>
                        <p>Cliente sem avaliações ainda.</p>
                        <p className="text-sm">Pode ser um novo usuário.</p>
                    </div>
                )}

                {/* Botão Fechar */}
                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#A75C00] text-white rounded-md hover:bg-[#8B4D00] transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}; 