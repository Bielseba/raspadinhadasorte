// transactionService.js
import { apiRequest } from '../api.js';

export async function getTransactions(token) {
    return apiRequest('/admin/transactions', 'GET', null, token);
}
