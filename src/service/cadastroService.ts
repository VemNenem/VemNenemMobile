const API_URL = 'https://api.vemnenem.app.br/api';

export interface CreateClientData {
    name: string;
    probableDateOfDelivery: string; // formato: YYYY-MM-DD
    babyGender: string;
    fatherName?: string;
    babyName?: string;
    email: string;
    password: string;
}

export interface CreateClientResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export const createClient = async (
    data: CreateClientData
): Promise<CreateClientResponse> => {
    try {
        const response = await fetch(`${API_URL}/createClient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || 'Erro ao criar cadastro',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};
