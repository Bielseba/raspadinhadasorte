// dashboardService.js - Serviço do dashboard para o admin
import { apiRequest } from '../utils/api.js';

export async function getDashboardStats(token, period = 'today') {
    try {
        const response = await apiRequest(`/admin/dashboard/stats?period=${period}`, 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        throw error;
    }
}

export async function getRevenueChart(token, period = 'month') {
    try {
        const response = await apiRequest(`/admin/dashboard/revenue?period=${period}`, 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do gráfico de receita:', error);
        throw error;
    }
}

export async function getPopularityChart(token) {
    try {
        const response = await apiRequest('/admin/dashboard/popularity', 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do gráfico de popularidade:', error);
        throw error;
    }
}

export async function getRecentActivity(token, limit = 10) {
    try {
        const response = await apiRequest(`/admin/dashboard/recent-activity?limit=${limit}`, 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar atividades recentes:', error);
        throw error;
    }
}

export async function getSystemHealth(token) {
    try {
        const response = await apiRequest('/admin/dashboard/system-health', 'GET', null, token);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar saúde do sistema:', error);
        throw error;
    }
}
