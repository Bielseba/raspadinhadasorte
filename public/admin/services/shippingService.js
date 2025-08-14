// shippingService.js - Serviço de envios para o admin
import { apiRequest } from '../utils/api.js';

export async function getShippings(token, filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.userId) queryParams.append('userId', filters.userId);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        
        const endpoint = `/admin/shippings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await apiRequest(endpoint, 'GET', null, token);
        return response.data || [];
    } catch (error) {
        console.error('Erro ao buscar envios:', error);
        throw error;
    }
}

export async function getShippingById(shippingId, token) {
    try {
        const response = await apiRequest(`/admin/shippings/${shippingId}`, 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar envio:', error);
        throw error;
    }
}

export async function updateShipping(shippingId, status, tracking, token) {
    try {
        const response = await apiRequest(`/admin/shippings/${shippingId}`, 'PUT', {
            status,
            tracking
        }, token);
        return response;
    } catch (error) {
        console.error('Erro ao atualizar envio:', error);
        throw error;
    }
}

export async function createShipping(shippingData, token) {
    try {
        const response = await apiRequest('/admin/shippings', 'POST', shippingData, token);
        return response;
    } catch (error) {
        console.error('Erro ao criar envio:', error);
        throw error;
    }
}

export async function deleteShipping(shippingId, token) {
    try {
        const response = await apiRequest(`/admin/shippings/${shippingId}`, 'DELETE', null, token);
        return response;
    } catch (error) {
        console.error('Erro ao deletar envio:', error);
        throw error;
    }
}
