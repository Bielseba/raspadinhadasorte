// scratchcardService.js
import { apiRequest } from '../utils/api.js';

export async function getScratchcards(token) {
    return apiRequest('/admin/scratchcards', 'GET', null, token);
}

export async function createScratchcard(data, token) {
    return apiRequest('/admin/scratchcards', 'POST', data, token);
}

export async function updateScratchcard(id, data, token) {
    return apiRequest(`/admin/scratchcards/${id}`, 'PUT', data, token);
}

export async function deleteScratchcard(id, token) {
    return apiRequest(`/admin/scratchcards/${id}`, 'DELETE', null, token);
}

export async function getScratchcardById(id, token) {
    return apiRequest(`/admin/scratchcards/${id}`, 'GET', null, token);
}

export async function getScratchcardPrizes(scratchcardId, token) {
    return apiRequest(`/admin/scratchcards/${scratchcardId}/prizes`, 'GET', null, token);
}

export async function createScratchcardPrize(scratchcardId, prizeData, token) {
    return apiRequest(`/admin/scratchcards/${scratchcardId}/prizes`, 'POST', prizeData, token);
}

export async function updateScratchcardPrize(prizeId, prizeData, token) {
    return apiRequest(`/admin/scratchcard-prizes/${prizeId}`, 'PUT', prizeData, token);
}

export async function deleteScratchcardPrize(prizeId, token) {
    return apiRequest(`/admin/scratchcard-prizes/${prizeId}`, 'DELETE', null, token);
}
