// authService.js
import { apiRequest } from '../api.js';

export async function loginAdmin(username, password) {
    return apiRequest('/login', 'POST', { username, password });
}
