const API_URL = 'https://api.vemnenem.app.br/api';

export interface Lista {
    id: number;
    documentId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
}

export interface CreateListRequest {
    name: string;
}

export interface UpdateListRequest {
    name: string;
}

export interface ListResponse {
    success: boolean;
    message?: string;
    data?: Lista[];
}

export interface ListDetailResponse {
    success: boolean;
    message?: string;
    data?: Lista;
}

export interface DeleteResponse {
    success: boolean;
    message?: string;
}

/**
 * @param jwt
 * @param data
 */
export const createList = async (
    jwt: string,
    data: CreateListRequest
): Promise<ListDetailResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        if (!data.name || data.name.trim() === '') {
            return {
                success: false,
                message: 'Nome da lista é obrigatório',
            };
        }

        const response = await fetch(`${API_URL}/createList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao criar lista',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

export const listList = async (jwt: string): Promise<ListResponse> => {
    try {


        if (!jwt) {
            console.log('listList - Token vazio!');
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }



        const response = await fetch(`${API_URL}/listList`, {
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
                message: result.message || result.error?.message || 'Erro ao buscar listas',
            };
        }
        const listas = Array.isArray(result) ? result : [];

        return {
            success: true,
            data: listas,
        };
    } catch (error) {
        console.error('Erro ao buscar listas:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * @param jwt 
 * @param listDocumentId
 * @param data
 */
export const updateList = async (
    jwt: string,
    listDocumentId: string,
    data: UpdateListRequest
): Promise<ListDetailResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        if (!listDocumentId) {
            return {
                success: false,
                message: 'ID da lista não fornecido',
            };
        }

        if (!data.name || data.name.trim() === '') {
            return {
                success: false,
                message: 'Nome da lista é obrigatório',
            };
        }

        const response = await fetch(
            `${API_URL}/updateList?listDocumentId=${listDocumentId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao atualizar lista',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao atualizar lista:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * @param jwt 
 * @param listDocumentId
 */
export const deleteList = async (
    jwt: string,
    listDocumentId: string
): Promise<DeleteResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        if (!listDocumentId) {
            return {
                success: false,
                message: 'ID da lista não fornecido',
            };
        }

        const response = await fetch(
            `${API_URL}/deleteList?listDocumentId=${listDocumentId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            try {
                const result = JSON.parse(responseText);
                return {
                    success: false,
                    message: result.message || result.error?.message || 'Erro ao deletar lista',
                };
            } catch {
                return {
                    success: false,
                    message: responseText || 'Erro ao deletar lista',
                };
            }
        }

        try {
            const result = JSON.parse(responseText);
            return {
                success: true,
                message: result.message || 'Lista deletada com sucesso',
            };
        } catch {
            return {
                success: true,
                message: 'Lista deletada com sucesso',
            };
        }
    } catch (error) {
        console.error('Erro ao deletar lista:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * @param dateString 
 * @returns 
 */
export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch (error) {
        return dateString;
    }
};

/**
 * @param dateString
 * @returns 
 */
export const formatDateTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        return dateString;
    }
};