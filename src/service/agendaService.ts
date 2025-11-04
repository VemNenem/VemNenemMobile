const API_URL = 'https://api.vemnenem.app.br/api';

export interface Schedule {
    id: number;
    documentId: string;
    name: string;
    description: string;
    date: string;
    time: string; 
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string | null;
}

export interface MonthScheduleResponse {
    success: boolean;
    message?: string;
    data?: { [date: string]: boolean };
}

export interface DayScheduleResponse {
    success: boolean;
    message?: string;
    data?: Schedule[];
}

export interface CreateScheduleData {
    name: string;
    description: string;
    date: string;
    time: string; 
}

export interface UpdateScheduleData {
    name: string;
    description: string;
    date: string; 
    time: string;
}

export interface ScheduleResponse {
    success: boolean;
    message?: string;
    data?: Schedule;
}

export interface DeleteScheduleResponse {
    success: boolean;
    message?: string;
}

const getCurrentDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getCurrentMonth = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

export const getMonthSchedule = async (
    jwt: string,
    month?: string 
): Promise<MonthScheduleResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const monthParam = month || getCurrentMonth();

        const response = await fetch(`${API_URL}/getMonthSchedule?month=${monthParam}`, {
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
                message: result.message || result.error?.message || 'Erro ao buscar eventos do mês',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao buscar eventos do mês:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

export const getDaySchedule = async (
    jwt: string,
    day?: string 
): Promise<DayScheduleResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const dayParam = day || getCurrentDate();

        const response = await fetch(`${API_URL}/getDaySchedule?day=${dayParam}`, {
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
                message: result.message || result.error?.message || 'Erro ao buscar eventos do dia',
            };
        }

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao buscar eventos do dia:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

export const createSchedule = async (
    jwt: string,
    data: CreateScheduleData
): Promise<ScheduleResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const response = await fetch(`${API_URL}/createSchedule`, {
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
                message: result.message || result.error?.message || 'Erro ao criar evento',
            };
        }

        return {
            success: true,
            data: result,
            message: 'Evento criado com sucesso!',
        };
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

export const updateSchedule = async (
    jwt: string,
    scheduleDocumentId: string,
    data: UpdateScheduleData
): Promise<ScheduleResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const response = await fetch(`${API_URL}/updateSchedule?scheduleDocumentId=${scheduleDocumentId}`, {
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
                message: result.message || result.error?.message || 'Erro ao atualizar evento',
            };
        }

        return {
            success: true,
            data: result,
            message: 'Evento atualizado com sucesso!',
        };
    } catch (error) {
        console.error('Erro ao atualizar evento:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};

export const deleteSchedule = async (
    jwt: string,
    scheduleDocumentId: string
): Promise<DeleteScheduleResponse> => {
    try {
        if (!jwt) {
            return {
                success: false,
                message: 'Token de autenticação não fornecido',
            };
        }

        const response = await fetch(`${API_URL}/deleteSchedule?scheduleDocumentId=${scheduleDocumentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        });

        if (!response.ok) {
            try {
                const result = await response.json();
                return {
                    success: false,
                    message: result.message || result.error?.message || 'Erro ao deletar evento',
                };
            } catch {
                return {
                    success: false,
                    message: 'Erro ao deletar evento',
                };
            }
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            return {
                success: true,
                message: result.message || 'Evento deletado com sucesso!',
            };
        } else {
            const textResult = await response.text();
            return {
                success: true,
                message: textResult || 'Evento deletado com sucesso!',
            };
        }
    } catch (error) {
        console.error('Erro ao deletar evento:', error);
        return {
            success: false,
            message: 'Erro de conexão. Tente novamente.',
        };
    }
};
