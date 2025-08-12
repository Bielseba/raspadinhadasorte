// userService.js
import { apiRequest } from '../api.js';

export async function getUsers(token) {
    return apiRequest('/admin/users', 'GET', null, token);
}

export async function updateUserBalance(userId, amount, action, token) {
    // action: 'add' ou 'remove'
    return apiRequest(`/admin/users/${userId}/balance`, 'PUT', { amount, action }, token);
}

export async function blockUser(userId, token) {
    return apiRequest(`/admin/users/${userId}/block`, 'POST', null, token);
}
