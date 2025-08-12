// settingsService.js
import { apiRequest } from '../api.js';

export async function getSettings(token) {
    return apiRequest('/admin/settings', 'GET', null, token);
}

export async function updateSettings(data, token) {
    return apiRequest('/admin/settings', 'PUT', data, token);
}
