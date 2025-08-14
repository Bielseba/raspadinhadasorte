// settingsService.js
import { apiRequest, API_BASE_URL } from '../utils/api.js';

export async function getSettings(token) {
    return apiRequest('/admin/settings', 'GET', null, token);
}

export async function updateSettings(data, token) {
    return apiRequest('/admin/settings', 'PUT', data, token);
}

export async function uploadBannerImage(file, bannerNumber, token) {
    const formData = new FormData();
    formData.append('banner', file);
    formData.append('bannerNumber', bannerNumber);
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/upload-banner`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Erro no upload do banner');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro no upload do banner:', error);
        throw error;
    }
}

export async function uploadLogoImage(file, token) {
    const formData = new FormData();
    formData.append('logo', file);
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/upload-logo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Erro no upload do logo');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro no upload do logo:', error);
        throw error;
    }
}
