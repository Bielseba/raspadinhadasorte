// scratchcardService.js
import { apiRequest } from '../api.js';

export async function getScratchcards(token) {
    return apiRequest('/admin/scratchcards', 'GET', null, token);
}

export async function createScratchcard(data, token) {
    return apiRequest('/admin/scratchcards', 'POST', data, token);
}

export async function updateScratchcard(id, data, token) {
    return apiRequest(`/admin/scratchcards/${id}`, 'PUT', data, token);
}
