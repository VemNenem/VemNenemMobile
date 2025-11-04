const API_URL = 'https://api.vemnenem.app.br/api';

export interface Schedule {
    id: number;
    documentId: string;
    name: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
    time: string;
}

export interface HomeData {
    currentWeek: number;
    remaining: {
        weeks: number;
        days: number;
    };
    schedule: Schedule[];
}

export interface HomeResponse {
    success: boolean;
    message?: string;
    data?: HomeData;
}

export const getHome = async (jwt: string): Promise<HomeResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const response = await fetch(`${API_URL}/getHome`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao buscar dados da home',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao buscar dados da home:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};
