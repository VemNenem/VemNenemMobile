import { getStoredJWT } from './loginService';

const API_URL = 'https://api.vemnenem.app.br/api';

export interface ChildbirthPlan {
    documentId: string;
    name: string;
    type: string;
    clientSelect: boolean;
}

export interface ListChildbirthPlanResponse {
    success: boolean;
    message?: string;
    data?: ChildbirthPlan[];
}

export interface SelectPlanResponse {
    success: boolean;
    message?: string;
}

export interface PDFResponse {
    success: boolean;
    message?: string;
    data?: string; // Changed from Blob | string to just string since it returns filename
}

/**
 * Função para listar planos de parto
 */
export const listChildbirthPlans = async (): Promise<ListChildbirthPlanResponse> => {
    try {
        const jwt = await getStoredJWT();

        if (!jwt) {
            return {
                success: false,
                message: 'Usuário não autenticado',
            };
        }

        const response = await fetch(`${API_URL}/listChildbirthPlan`, {
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
                message: result.message || result.error?.message || 'Erro ao listar planos de parto',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao listar planos de parto:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Função para selecionar ou desselecionar um plano de parto
 */
export const selectOrUnselectChildbirthPlan = async (
    planDocumentId: string,
    action: 'select' | 'unselect'
): Promise<SelectPlanResponse> => {
    try {
        const jwt = await getStoredJWT();

        if (!jwt) {
            return {
                success: false,
                message: 'Usuário não autenticado',
            };
        }

        const response = await fetch(
            `${API_URL}/selectOrUnselectChildbirthPlan?planDocumentId=${planDocumentId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify({ type: action }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao atualizar plano de parto',
            };
        }

        return {
            success: true,
            message: `Plano ${action === 'select' ? 'selecionado' : 'desmarcado'} com sucesso`,
        };
    } catch (error) {
        console.error('Erro ao atualizar plano de parto:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Função para gerar PDF do plano de parto
 */
export const generateChildbirthPlanPDF = async (): Promise<PDFResponse> => {
    try {
        const jwt = await getStoredJWT();

        if (!jwt) {
            return {
                success: false,
                message: 'Usuário não autenticado',
            };
        }

        const response = await fetch(`${API_URL}/pdfChildbirthPlan`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
            },
        });

        if (!response.ok) {
            try {
                const result = await response.json();
                return {
                    success: false,
                    message: result.message || result.error?.message || 'Erro ao gerar PDF',
                };
            } catch {
                return {
                    success: false,
                    message: 'Erro ao gerar PDF',
                };
            }
        }

        // Ler a resposta como texto (nome do arquivo)
        const filename = await response.text();

        // Construir a URL completa do PDF
        const pdfUrl = `https://api.vemnenem.app.br/${filename}`;

        return {
            success: true,
            data: pdfUrl,
        };
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};
