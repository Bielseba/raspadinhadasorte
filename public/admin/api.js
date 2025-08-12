// api.js
// Módulo base para requests à API

const API_BASE_URL = 'http://localhost:3000/api'; // Ajuste conforme necessário

async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const options = {
        method,
        headers,
    };
    if (data) options.body = JSON.stringify(data);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Erro na requisição');
    }
    return response.json();
}

export { apiRequest, API_BASE_URL };
