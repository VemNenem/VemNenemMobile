const API_URL = 'https://api.vemnenem.app.br/api';

export interface TermsResponse {
    success: boolean;
    message?: string;
    data?: any;
}

/**
 * @param type
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

        if (!response.ok) {
            return {
                success: false,
                message: 'Erro ao buscar termos',
            };
        }

        const contentType = response.headers.get('content-type');
        let result;

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            const text = await response.text();
            result = { content: text };
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
