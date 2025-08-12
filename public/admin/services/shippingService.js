// shippingService.js
import { apiRequest } from '../api.js';

export async function getShippings(token) {
    return apiRequest('/admin/shippings', 'GET', null, token);
}

export async function updateShipping(id, status, tracking, token) {
    return apiRequest(`/admin/shippings/${id}`, 'PUT', { status, tracking }, token);
}
