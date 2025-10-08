const API_URL = 'https://api.vemnenem.app.br/api';
const BASE_URL = 'https://api.vemnenem.app.br';

export interface ImageFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

export interface PostImage {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        thumbnail?: ImageFormat;
        small?: ImageFormat;
        medium?: ImageFormat;
        large?: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    folderPath: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
}

export interface Post {
    id: number;
    documentId: string;
    title: string;
    text: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
    image: PostImage | null;
}

export interface ListPostsResponse {
    success: boolean;
    message?: string;
    data?: Post[];
}

export interface PostDetailResponse {
    success: boolean;
    message?: string;
    data?: Post;
}

/**
 * Retorna a URL completa da imagem
 * @param imageUrl - URL relativa da imagem (ex: /uploads/imagem_teste_5f5df3513c.jpg)
 * @returns URL completa da imagem
 */
export const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${BASE_URL}${imageUrl}`;
};

/**
 * Busca a lista de posts do blog
 * Requer autenticação via JWT
 */
export const listPostsInClient = async (jwt: string): Promise<ListPostsResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const response = await fetch(`${API_URL}/listPostsInClient`, {
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
                message: result.message || result.error?.message || 'Erro ao buscar posts',
            };
        }

        // Garantir que result é um array
        const posts = Array.isArray(result) ? result : [];

        return {
            success: true,
            data: posts,
        };
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Busca os detalhes de um post específico
 * @param jwt - Token JWT do usuário logado
 * @param postDocumentId - Document ID do post
 * Requer autenticação via JWT
 */
export const getPostsInClient = async (
    jwt: string,
    postDocumentId: string
): Promise<PostDetailResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        if (!postDocumentId) {
            return {
                success: false,
                message: 'ID do post não fornecido',
            };
        }

        const response = await fetch(
            `${API_URL}/getPostsInClient?postDocumentId=${postDocumentId}`,
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
                message: result.message || result.error?.message || 'Erro ao buscar detalhes do post',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao buscar detalhes do post:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Formata a data para exibição
 * @param dateString - Data em formato ISO
 * @returns Data formatada (ex: "01/10/2025")
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
 * Formata a data com hora para exibição
 * @param dateString - Data em formato ISO
 * @returns Data e hora formatadas (ex: "01/10/2025 às 20:22")
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

/**
 * Trunca o texto para exibição em preview
 * @param text - Texto completo
 * @param maxLength - Tamanho máximo
 * @returns Texto truncado
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};
