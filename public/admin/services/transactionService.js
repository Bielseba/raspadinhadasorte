// transactionService.js - Serviço de transações para o admin
import { apiRequest } from '../utils/api.js';

export async function getTransactions(token, filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.userId) queryParams.append('userId', filters.userId);
        
        const endpoint = `/admin/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await apiRequest(endpoint, 'GET', null, token);
        return response.data || [];
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        throw error;
    }
}

export async function getTransactionById(transactionId, token) {
    try {
        const response = await apiRequest(`/admin/transactions/${transactionId}`, 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar transação:', error);
        throw error;
    }
}

export async function updateTransactionStatus(transactionId, status, token) {
    try {
        const response = await apiRequest(`/admin/transactions/${transactionId}/status`, 'PUT', {
            status
        }, token);
        return response;
    } catch (error) {
        console.error('Erro ao atualizar status da transação:', error);
        throw error;
    }
}

export async function getTransactionStats(token, period = 'today') {
    try {
        const response = await apiRequest(`/admin/transactions/stats?period=${period}`, 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas das transações:', error);
        throw error;
    }
}
