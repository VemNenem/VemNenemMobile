import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.vemnenem.app.br/api';

export interface LoginData {
    identifier: string;
    password: string;
    role: number;
    requestRefresh: boolean;
}

export interface User {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    jwt?: string;
    user?: User;
    refreshToken?: string;
}

export interface RefreshTokenData {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    message?: string;
    jwt?: string;
    refreshToken?: string;
}

// Chaves para AsyncStorage
const STORAGE_KEYS = {
    JWT: '@VemNenem:jwt',
    REFRESH_TOKEN: '@VemNenem:refreshToken',
    USER: '@VemNenem:user',
    REMEMBER_ME: '@VemNenem:rememberMe',
};

/**
 * Função para realizar o login
 */
export const login = async (
    identifier: string,
    password: string,
    rememberMe: boolean = false
): Promise<LoginResponse> => {
    try {
        const loginData: LoginData = {
            identifier: identifier.toLowerCase(),
            password,
            role: 1,
            requestRefresh: rememberMe,
        };

        const response = await fetch(`${API_URL}/auth/local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao fazer login',
            };
        }

        // Salvar dados no AsyncStorage
        if (result.jwt) {
            await AsyncStorage.setItem(STORAGE_KEYS.JWT, result.jwt);
        }

        if (result.user) {
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
        }

        if (result.refreshToken && rememberMe) {
            await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
            await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
        }

        return {
            success: true,
            jwt: result.jwt,
            user: result.user,
            refreshToken: result.refreshToken,
        };
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Função para renovar o token usando o refreshToken
 */
export const refreshToken = async (
    refreshTokenValue: string
): Promise<RefreshTokenResponse> => {
    try {
        const refreshData: RefreshTokenData = {
            refreshToken: refreshTokenValue,
        };

        const response = await fetch(`${API_URL}/auth/local/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(refreshData),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message || result.error?.message || 'Erro ao renovar token',
            };
        }

        // Atualizar tokens no AsyncStorage
        if (result.jwt) {
            await AsyncStorage.setItem(STORAGE_KEYS.JWT, result.jwt);
        }

        if (result.refreshToken) {
            await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
        }

        return {
            success: true,
            jwt: result.jwt,
            refreshToken: result.refreshToken,
        };
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

/**
 * Função para obter o token JWT armazenado
 */
export const getStoredJWT = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.JWT);
    } catch (error) {
        console.error('Erro ao obter JWT:', error);
        return null;
    }
};

/**
 * Função para obter o refreshToken armazenado
 */
export const getStoredRefreshToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
        console.error('Erro ao obter refreshToken:', error);
        return null;
    }
};

/**
 * Função para obter o usuário armazenado
 */
export const getStoredUser = async (): Promise<User | null> => {
    try {
        const userString = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        return userString ? JSON.parse(userString) : null;
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
    }
};

/**
 * Função para verificar se o usuário optou por "lembrar de mim"
 */
export const getRememberMe = async (): Promise<boolean> => {
    try {
        const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
        return rememberMe === 'true';
    } catch (error) {
        console.error('Erro ao obter rememberMe:', error);
        return false;
    }
};

/**
 * Função para fazer logout (limpar dados armazenados)
 */
export const logout = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.JWT,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER,
            STORAGE_KEYS.REMEMBER_ME,
        ]);
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
};

/**
 * Função para verificar se o usuário está autenticado
 * e tentar renovar o token se necessário
 */
export const checkAuth = async (): Promise<boolean> => {
    try {
        const jwt = await getStoredJWT();

        if (jwt) {
            // Verificar se o token ainda é válido (você pode adicionar lógica para verificar expiração)
            return true;
        }

        // Tentar renovar o token se tiver refreshToken
        const storedRefreshToken = await getStoredRefreshToken();
        const rememberMe = await getRememberMe();

        if (storedRefreshToken && rememberMe) {
            const refreshResult = await refreshToken(storedRefreshToken);
            return refreshResult.success;
        }

        return false;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false;
    }
};
