export interface RankingUsuario {
    id_usuario: string;
    score: number;
    nivel: NivelRanking;
    total_avaliacoes: number;
    data_criacao: Date;
    data_atualizacao: Date;
}

export enum NivelRanking {
    BRONZE = 'Bronze',
    PRATA = 'Prata',
    OURO = 'Ouro',
    PLATINA = 'Platina',
    DIAMANTE = 'Diamante'
}

export interface AvaliacaoUsuario {
    id_usuario: string;
    id_servico: string;
    aspectos_positivos: string[];
    aspectos_negativos: string[];
    comentario?: string;
}

export interface EstatisticasRanking {
    nivel_atual: NivelRanking;
    score_atual: number;
    total_avaliacoes: number;
    aspectos_positivos: Array<{
        aspecto: string;
        percentual: number;
    }>;
    aspectos_negativos: Array<{
        aspecto: string;
        percentual: number;
    }>;
}

export interface RankingData {
    nivel: string;
    score: number;
    total_avaliacoes: number;
    aspectos_negativos: Array<{
        aspecto: string;
        percentual: number;
    }>;
}

export interface ConfiguracaoAspectos {
    positivos: AspectoPositivo[];
    negativos: AspectoNegativo[];
}

export interface AspectoPositivo {
    valor: string;
    label: string;
    peso: number;
}

export interface AspectoNegativo {
    valor: string;
    label: string;
    peso: number;
} 