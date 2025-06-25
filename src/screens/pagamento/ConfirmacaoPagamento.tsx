import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { URLAPI } from '../../constants/ApiUrl';
import { AvaliacaoUsuario } from '../../components/ranking/AvaliacaoUsuario';

export const ConfirmacaoPagamento = () => {
    const { idServico } = useParams<{ idServico: string }>();
    const navigate = useNavigate();
    const [showAvaliacao, setShowAvaliacao] = useState(false);
    const [servicoInfo, setServicoInfo] = useState<any>(null);

    const atualizarStatus = async (id_servico: string | undefined, status: string) => {
        try {
            const data = {
                id_servico: id_servico,
                status: status
            }

            const response = await axios.put(`${URLAPI}/servicos`, data);
            console.log(response.data);
            
            // Buscar informações do serviço para a avaliação
            if (response.data) {
                setServicoInfo(response.data);
            }
        } catch (error: unknown) {
            console.log(error);
        }
    }

    useEffect(()=>{
        atualizarStatus(idServico,'concluido')
    },[])

    const handleAvaliacaoConcluida = () => {
        setShowAvaliacao(false);
        // Redirecionar para a página de serviços após avaliação
        setTimeout(() => {
            navigate('/servicos');
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-5">
            {!showAvaliacao ? (
                <>
                    <div className="mb-8">
                        <svg 
                            className="w-24 h-24 text-green-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
                        Pagamento Aprovado!
                    </h1>
                    <p className="text-lg text-gray-600 mb-6 text-center">
                        O valor foi recebido com sucesso
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-md">
                        <h2 className="text-lg font-semibold text-blue-800 mb-3 text-center">
                            🎉 Serviço Concluído!
                        </h2>
                        <p className="text-blue-700 text-center mb-4">
                            Agora você pode avaliar o cliente para ajudar outros fornecedores.
                        </p>
                        <button 
                            onClick={() => setShowAvaliacao(true)}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                        >
                            📝 Avaliar Cliente
                        </button>
                    </div>

                    <button 
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 ease-in-out shadow-md"
                        onClick={() => navigate('/servicos')}
                    >
                        Voltar para Serviços
                    </button>
                </>
            ) : (
                <div className="w-full max-w-4xl">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-[#8B4000] mb-2">
                            Avaliar Cliente
                        </h2>
                        <p className="text-gray-600">
                            Conte como foi sua experiência com este cliente
                        </p>
                    </div>
                    
                    <AvaliacaoUsuario
                        id_usuario={servicoInfo?.id_usuario || '123456'}
                        id_servico={idServico || '789012'}
                        onAvaliacaoConcluida={handleAvaliacaoConcluida}
                        onCancelar={() => setShowAvaliacao(false)}
                    />
                </div>
            )}
        </div>
    );
};