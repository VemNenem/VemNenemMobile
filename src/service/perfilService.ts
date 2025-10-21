const API_URL = 'https://api.vemnenem.app.br/api';

export interface User {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    password?: string;
    resetPasswordToken: string | null;
    confirmationToken: string | null;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
}

export interface ClientData {
    id: number;
    documentId: string;
    name: string;
    probableDateOfDelivery: string;
    babyGender: string;
    fatherName: string;
    babyName: string;
    acceptTerm: boolean;
    acceptTermDate: string;
    acceptPrivacyPoliciesDate: string;
    acceptPrivacyPolicies: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
    user: User;
}

export interface MyDataResponse {
    success: boolean;
    message?: string;
    data?: ClientData;
}

export interface UpdateClientData {
    name: string;
    probableDateOfDelivery: string; // formato: YYYY-MM-DD
    babyGender: string;
    fatherName?: string;
    babyName?: string;
}

export interface UpdateClientResponse {
    success: boolean;
    message?: string;
    data?: ClientData;
}

export interface ChangePasswordData {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message?: string;
}

export interface DeleteAccountResponse {
    success: boolean;
    message?: string;
}

/**
 * Busca os dados do cliente/perfil logado
 * Requer autenticação - passa o JWT do usuário logado
 */
export const getMyData = async (jwt: string): Promise<MyDataResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const response = await fetch(`${API_URL}/getMyData`, {
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
                message: result.message || result.error?.message || 'Erro ao buscar dados do perfil',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Atualiza os dados do cliente/perfil
 * Requer autenticação - passa o JWT do usuário logado
 */
export const updateClient = async (
    jwt: string,
    data: UpdateClientData
): Promise<UpdateClientResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const response = await fetch(`${API_URL}/updateClient`, {
            method: 'PUT',
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
                message: result.message || result.error?.message || 'Erro ao atualizar perfil',
            };
        }

        return {
            success: true,
            data: result,
            message: 'Perfil atualizado com sucesso!',
        };
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Altera a senha do usuário
 * Requer autenticação - passa o JWT do usuário logado
 */
export const changePassword = async (
    jwt: string,
    data: ChangePasswordData
): Promise<ChangePasswordResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        // Validação básica
        if (data.password !== data.passwordConfirmation) {
            return {
                success: false,
                message: 'As senhas não coincidem',
            };
        }

        if (data.password.length < 6) {
            return {
                success: false,
                message: 'A senha deve ter no mínimo 6 caracteres',
            };
        }

        const response = await fetch(`${API_URL}/auth/change-password`, {
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
                message: result.message || result.error?.message || 'Erro ao alterar senha',
            };
        }

        return {
            success: true,
            message: 'Senha alterada com sucesso!',
        };
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Deleta a conta do cliente/usuário
 * Requer autenticação - passa o JWT do usuário logado
 */
export const deleteMyClient = async (jwt: string): Promise<DeleteAccountResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const response = await fetch(`${API_URL}/deleteMyClient`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        });

        // A API retorna uma string pura, não JSON
        const text = await response.text();

        if (!response.ok) {
            return {
                success: false,
                message: text || 'Erro ao deletar conta',
            };
        }

        // Retorna a mensagem da API (ex: "Usuário excluido com sucesso")
        return {
            success: true,
            message: text || 'Conta deletada com sucesso!',
        };
    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};
