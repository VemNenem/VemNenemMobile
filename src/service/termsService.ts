const API_URL = 'https://api.vemnenem.app.br/api';

export interface TermsResponse {
    success: boolean;
    message?: string;
    data?: any;
}

/**
 * Busca os termos de uso ou política de privacidade
 * @param type - 'privacy' para Política de Privacidade ou 'terms' para Termos de Uso
 */
export const getTerms = async (
    type: 'privacy' | 'terms' = 'privacy'
): Promise<TermsResponse> => {
    try {
        const response = await fetch(`${API_URL}/listTerms?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || 'Erro ao buscar termos',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao buscar termos:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};
