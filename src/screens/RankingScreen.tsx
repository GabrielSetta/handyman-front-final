import React, { useState } from 'react';
import { VisualizacaoRanking } from '../components/ranking/VisualizacaoRanking';
import { AvaliacaoUsuario } from '../components/ranking/AvaliacaoUsuario';
import { PreviewRankingUsuario } from '../components/ranking/PreviewRankingUsuario';

export const RankingScreen = () => {
    const [showAvaliacao, setShowAvaliacao] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    
    // IDs de teste
    const idUsuarioTeste = '123456';
    const idServicoTeste = '789012';

    const handleAvaliacaoConcluida = () => {
        setShowAvaliacao(false);
        // Aqui você poderia recarregar dados ou mostrar uma mensagem de sucesso
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#8B4000] mb-2">
                        Sistema de Ranking - Demonstração
                    </h1>
                    <p className="text-gray-600">
                        Teste todas as funcionalidades do sistema de ranking
                    </p>
                </div>

                {/* Botões de Ação */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Botão para Avaliar Usuário */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-[#8B4000] mb-3">
                            📝 Avaliar Usuário (Fornecedor)
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Simula um fornecedor avaliando um usuário após um serviço
                        </p>
                        <button
                            onClick={() => setShowAvaliacao(true)}
                            className="w-full px-4 py-2 bg-[#A75C00] text-white rounded-md hover:bg-[#8B4D00] transition-colors"
                        >
                            Avaliar Cliente
                        </button>
                    </div>

                    {/* Botão para Ver Preview */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-[#8B4000] mb-3">
                            👁️ Ver Ranking do Usuário (Fornecedor)
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Simula um fornecedor visualizando o ranking de um cliente
                        </p>
                        <button
                            onClick={() => setShowPreview(true)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Ver Ranking
                        </button>
                    </div>

                    {/* Informações */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-[#8B4000] mb-3">
                            ℹ️ Informações
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>• ID Usuário: {idUsuarioTeste}</p>
                            <p>• ID Serviço: {idServicoTeste}</p>
                            <p>• Backend: Porta 3003</p>
                        </div>
                    </div>
                </div>

                {/* Visualização do Ranking do Usuário */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-[#8B4000] mb-4 text-center">
                        Seu Ranking (Usuário)
                    </h2>
                    <VisualizacaoRanking id_usuario={idUsuarioTeste} />
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
                                <li>• <strong>Bronze:</strong> 0-49 pontos</li>
                                <li>• <strong>Prata:</strong> 50-69 pontos</li>
                                <li>• <strong>Ouro:</strong> 70-79 pontos</li>
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

                {/* Modais */}
                {showAvaliacao && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <AvaliacaoUsuario
                                    id_usuario={idUsuarioTeste}
                                    id_servico={idServicoTeste}
                                    onAvaliacaoConcluida={handleAvaliacaoConcluida}
                                    onCancelar={() => setShowAvaliacao(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {showPreview && (
                    <PreviewRankingUsuario
                        id_usuario={idUsuarioTeste}
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </div>
        </div>
    );
}; 