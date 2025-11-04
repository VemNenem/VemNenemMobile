const API_URL = 'https://api.vemnenem.app.br/api';

export interface ForgotPasswordData {
    email: string;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message?: string;
}

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

        const contentType = response.headers.get('content-type');
        let result;

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
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

export interface ResetPasswordData {
    resetPasswordToken: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message?: string;
}

export const resetPassword = async (
    data: ResetPasswordData
): Promise<ResetPasswordResponse> => {
    try {
        if (!data.resetPasswordToken || !data.resetPasswordToken.trim()) {
            return {
                success: false,
                message: 'Por favor, insira o código de verificação',
            };
        }

        if (!data.password || data.password.length < 8) {
            return {
                success: false,
                message: 'A senha deve ter no mínimo 8 caracteres',
            };
        }

        const hasLowercase = /[a-z]/.test(data.password);
        const hasUppercase = /[A-Z]/.test(data.password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.password);

        if (!hasLowercase || !hasUppercase || !hasSpecialChar) {
            return {
                success: false,
                message: 'A senha deve conter pelo menos uma letra minúscula, uma maiúscula e um caractere especial',
            };
        }

        if (data.password !== data.confirmPassword) {
            return {
                success: false,
                message: 'As senhas não coincidem',
            };
        }

        const response = await fetch(`${API_URL}/resetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resetPasswordToken: data.resetPasswordToken.trim(),
                password: data.password,
                confirmPassword: data.confirmPassword,
            }),
        });

        const contentType = response.headers.get('content-type');
        let result;

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            const text = await response.text();
            result = { message: text };
        }

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao redefinir senha',
            };
        }

        return {
            success: true,
            message: result.message || 'Senha redefinida com sucesso',
        };
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};
