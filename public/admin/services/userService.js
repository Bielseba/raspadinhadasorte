// userService.js - Serviço de gerenciamento de usuários para o admin
import { apiRequest } from '../utils/api.js';

export async function getUsers(token) {
    try {
        const response = await apiRequest('/admin/users', 'GET', null, token);
        return response.data || [];
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
}

export async function getUserById(userId, token) {
    try {
        const response = await apiRequest(`/admin/users/${userId}`, 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
}

export async function updateUserBalance(userId, amount, action, token) {
    try {
        const response = await apiRequest(`/admin/users/${userId}/balance`, 'PUT', {
            amount,
            action
        }, token);
        return response;
    } catch (error) {
        console.error('Erro ao atualizar saldo:', error);
        throw error;
    }
}

export async function blockUser(userId, token) {
    try {
        const response = await apiRequest(`/admin/users/${userId}/block`, 'PUT', null, token);
        return response;
    } catch (error) {
        console.error('Erro ao bloquear usuário:', error);
        throw error;
    }
}

export async function getUserTransactions(userId, token) {
    try {
        const response = await apiRequest(`/admin/users/${userId}/transactions`, 'GET', null, token);
        return response.data || [];
    } catch (error) {
        console.error('Erro ao buscar transações do usuário:', error);
        throw error;
    }
}
