const API_URL = 'https://api.vemnenem.app.br/api';

export interface Topic {
    id: number;
    documentId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
}

export interface CreateTopicRequest {
    name: string;
    listDocumentId: string;
}

export interface UpdateTopicRequest {
    name: string;
}

export interface TopicResponse {
    success: boolean;
    message?: string;
    data?: Topic[];
}

export interface TopicDetailResponse {
    success: boolean;
    message?: string;
    data?: Topic;
}

export interface DeleteTopicResponse {
    success: boolean;
    message?: string;
}

/**
 * @param jwt
 * @param data
 */
export const createTopic = async (
    jwt: string,
    data: CreateTopicRequest
): Promise<TopicDetailResponse> => {
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
                message: 'Nome do tópico é obrigatório',
            };
        }

        if (!data.listDocumentId) {
            return {
                success: false,
                message: 'ID da lista é obrigatório',
            };
        }

        const response = await fetch(`${API_URL}/createTopic`, {
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
                message: result.message || result.error?.message || 'Erro ao criar tópico',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao criar tópico:', error);
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
export const listTopic = async (
    jwt: string,
    listDocumentId: string
): Promise<TopicResponse> => {
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
            `${API_URL}/listTopic?listDocumentId=${listDocumentId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao buscar tópicos',
            };
        }
        const topics = Array.isArray(result) ? result : [];

        return {
            success: true,
            data: topics,
        };
    } catch (error) {
        console.error('Erro ao buscar tópicos:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * @param jwt
 * @param topicDocumentId
 * @param data
 */
export const updateTopic = async (
    jwt: string,
    topicDocumentId: string,
    data: UpdateTopicRequest
): Promise<TopicDetailResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        if (!topicDocumentId) {
            return {
                success: false,
                message: 'ID do tópico não fornecido',
            };
        }

        if (!data.name || data.name.trim() === '') {
            return {
                success: false,
                message: 'Nome do tópico é obrigatório',
            };
        }

        const response = await fetch(
            `${API_URL}/updateTopic?topicDocumentId=${topicDocumentId}`,
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
                message: result.message || result.error?.message || 'Erro ao atualizar tópico',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao atualizar tópico:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * @param jwt
 * @param topicDocumentId
 */
export const deleteTopic = async (
    jwt: string,
    topicDocumentId: string
): Promise<DeleteTopicResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        if (!topicDocumentId) {
            return {
                success: false,
                message: 'ID do tópico não fornecido',
            };
        }

        const response = await fetch(
            `${API_URL}/deleteTopic?topicDocumentId=${topicDocumentId}`,
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
                    message: result.message || result.error?.message || 'Erro ao deletar tópico',
                };
            } catch {
                return {
                    success: false,
                    message: responseText || 'Erro ao deletar tópico',
                };
            }
        }

        try {
            const result = JSON.parse(responseText);
            return {
                success: true,
                message: result.message || 'Tópico deletado com sucesso',
            };
        } catch {
            return {
                success: true,
                message: 'Tópico deletado com sucesso',
            };
        }
    } catch (error) {
        console.error('Erro ao deletar tópico:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};