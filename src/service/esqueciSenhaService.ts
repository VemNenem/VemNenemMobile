const API_URL = 'https://api.vemnenem.app.br/api';

export interface ForgotPasswordData {
    email: string;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message?: string;
}

/**
 * Envia email de recuperação de senha
 * Não requer autenticação
 */
export const forgotPassword = async (
    data: ForgotPasswordData
): Promise<ForgotPasswordResponse> => {
    try {
        if (!data.email || !data.email.trim()) {
            return {
                success: false,
                message: 'Por favor, insira um email válido',
            };
        }

        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return {
                success: false,
                message: 'Por favor, insira um email válido',
            };
        }

        const response = await fetch(`${API_URL}/forgotPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: data.email.trim() }),
        });

        // Verificar o tipo de conteúdo da resposta
        const contentType = response.headers.get('content-type');
        let result;

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            // Se não for JSON, ler como texto
            const text = await response.text();
            result = { message: text };
        }

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao enviar email de recuperação',
            };
        }

        return {
            success: true,
            message: result.message || 'Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.',
        };
    } catch (error) {
        console.error('Erro ao enviar email de recuperação:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};
