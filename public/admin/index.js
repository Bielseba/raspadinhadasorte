// index.js
import { loginAdmin } from './services/authService.js';
import { getUsers, updateUserBalance, blockUser } from './services/userService.js';
import { getScratchcards, createScratchcard, updateScratchcard } from './services/scratchcardService.js';
import { getTransactions } from './services/transactionService.js';
import { getShippings, updateShipping } from './services/shippingService.js';
import { getSettings, updateSettings } from './services/settingsService.js';

//Login
export async function handleLogin(username, password) {
    try {
        const result = await loginAdmin(username, password);
        // Salvar token em localStorage/sessionStorage se necessário
        return result;
    } catch (err) {
        alert('Erro ao fazer login: ' + err.message);
        throw err;
    }
}

//Listar usuários
export async function fetchUsers(token) {
    return getUsers(token);
}

//Atualizar saldo do usuário
export async function changeUserBalance(userId, amount, action, token) {
    return updateUserBalance(userId, amount, action, token);
}

//Bloquear usuário
export async function blockUserById(userId, token) {
    return blockUser(userId, token);
}

//Listar raspadinhas
export async function fetchScratchcards(token) {
    return getScratchcards(token);
}

//Criar raspadinha
export async function createNewScratchcard(data, token) {
    return createScratchcard(data, token);
}

//Editar raspadinha
export async function editScratchcard(id, data, token) {
    return updateScratchcard(id, data, token);
}

//Listar transações
export async function fetchTransactions(token) {
    return getTransactions(token);
}

//Listar envios
export async function fetchShippings(token) {
    return getShippings(token);
}

//Atualizar envio
export async function updateShippingStatus(id, status, tracking, token) {
    return updateShipping(id, status, tracking, token);
}

//Buscar configurações
export async function fetchSettings(token) {
    return getSettings(token);
}

//Atualizar configurações
export async function saveSettings(data, token) {
    return updateSettings(data, token);
}
