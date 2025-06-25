import React, { useState, useEffect } from 'react';
import { URLAPI } from '../../constants/ApiUrl';
import { AspectoPositivo, AspectoNegativo, ConfiguracaoAspectos } from '../../types/rankingType';
import { toast } from 'react-toastify';

interface AvaliacaoUsuarioProps {
    id_usuario: string;
    id_servico: string;
    onAvaliacaoConcluida: () => void;
    onCancelar: () => void;
}

export const AvaliacaoUsuario: React.FC<AvaliacaoUsuarioProps> = ({
    id_usuario,
    id_servico,
    onAvaliacaoConcluida,
    onCancelar
}) => {
    const [aspectosPositivos, setAspectosPositivos] = useState<string[]>([]);
    const [aspectosNegativos, setAspectosNegativos] = useState<string[]>([]);
    const [comentario, setComentario] = useState('');
    const [configuracao, setConfiguracao] = useState<ConfiguracaoAspectos | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregarConfiguracao();
    }, []);

    const carregarConfiguracao = async () => {
        try {
            const response = await fetch(`${URLAPI}/ranking/configuracao-aspectos`);
            const data = await response.json();
            setConfiguracao(data);
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
            toast.error('Erro ao carregar configuração de aspectos');
        }
    };

    const toggleAspectoPositivo = (aspecto: string) => {
        setAspectosPositivos(prev => 
            prev.includes(aspecto) 
                ? prev.filter(a => a !== aspecto)
                : [...prev, aspecto]
        );
    };

    const toggleAspectoNegativo = (aspecto: string) => {
        setAspectosNegativos(prev => 
            prev.includes(aspecto) 
                ? prev.filter(a => a !== aspecto)
                : [...prev, aspecto]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (aspectosPositivos.length === 0 && aspectosNegativos.length === 0) {
            toast.warning('Selecione pelo menos um aspecto para avaliar');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${URLAPI}/ranking/avaliar-usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario,
                    id_servico,
                    aspectos_positivos: aspectosPositivos,
                    aspectos_negativos: aspectosNegativos,
                    comentario: comentario.trim() || undefined
                })
            });

            if (response.ok) {
                toast.success('Avaliação enviada com sucesso!');
                onAvaliacaoConcluida();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Erro ao enviar avaliação');
            }
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            toast.error('Erro ao enviar avaliação');
        } finally {
            setLoading(false);
        }
    };

    if (!configuracao) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A75C00]"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#8B4000] mb-6 text-center">
                Avaliar Cliente
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Aspectos Positivos */}
                <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-3">
                        ✅ Aspectos Positivos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {configuracao.positivos.map((aspecto) => (
                            <label key={aspecto.valor} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={aspectosPositivos.includes(aspecto.valor)}
                                    onChange={() => toggleAspectoPositivo(aspecto.valor)}
                                    className="rounded border-gray-300 text-[#A75C00] focus:ring-[#A75C00]"
                                />
                                <span className="text-sm text-gray-700">{aspecto.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Aspectos Negativos */}
                <div>
                    <h3 className="text-lg font-semibold text-red-700 mb-3">
                        ❌ Aspectos Negativos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {configuracao.negativos.map((aspecto) => (
                            <label key={aspecto.valor} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={aspectosNegativos.includes(aspecto.valor)}
                                    onChange={() => toggleAspectoNegativo(aspecto.valor)}
                                    className="rounded border-gray-300 text-[#A75C00] focus:ring-[#A75C00]"
                                />
                                <span className="text-sm text-gray-700">{aspecto.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Comentário */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentário (opcional)
                    </label>
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A75C00] focus:border-transparent"
                        placeholder="Adicione um comentário sobre sua experiência com este cliente..."
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {comentario.length}/500 caracteres
                    </p>
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || (aspectosPositivos.length === 0 && aspectosNegativos.length === 0)}
                        className="px-6 py-2 bg-[#A75C00] text-white rounded-md hover:bg-[#8B4D00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                </div>
            </form>
        </div>
    );
}; 