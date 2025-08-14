// authService.js - Serviço de autenticação para o admin
import { apiRequest } from '../utils/api.js';

export async function loginAdmin(email, password) {
    try {
        const response = await apiRequest('/admin/login', 'POST', { email, password });
        
        if (response.success) {
            return {
                success: true,
                token: response.token,
                user: response.user
            };
        } else {
            throw new Error(response.message || 'Login falhou');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}

export async function logoutAdmin(token) {
    try {
        await apiRequest('/admin/logout', 'POST', null, token);
        return { success: true };
    } catch (error) {
        console.error('Erro no logout:', error);
        throw error;
    }
}

export async function validateToken(token) {
    try {
        const response = await apiRequest('/admin/validate-token', 'GET', null, token);
        return response.success;
    } catch (error) {
        return false;
    }
}
