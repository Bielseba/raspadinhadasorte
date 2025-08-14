// app.js - Módulo principal do painel de administração
import { loginAdmin } from './services/authService.js';
import { getUsers, updateUserBalance, blockUser, getUserById, getUserTransactions } from './services/userService.js';
import { 
    getScratchcards, 
    createScratchcard, 
    updateScratchcard, 
    deleteScratchcard,
    getScratchcardById,
    getScratchcardPrizes,
    createScratchcardPrize,
    updateScratchcardPrize,
    deleteScratchcardPrize
} from './services/scratchcardService.js';
import { getTransactions, getTransactionById, updateTransactionStatus, getTransactionStats } from './services/transactionService.js';
import { getShippings, updateShipping, getShippingById, createShipping, deleteShipping } from './services/shippingService.js';
import { 
    getSettings, 
    updateSettings, 
    uploadBannerImage, 
    uploadLogoImage 
} from './services/settingsService.js';
import { uploadImage, deleteImage, previewImage } from './services/imageService.js';
import { 
    getDashboardStats, 
    getRevenueChart, 
    getPopularityChart, 
    getRecentActivity, 
    getSystemHealth 
} from './services/dashboardService.js';

// =========== FUNÇÕES DE AUTENTICAÇÃO ===========
export async function handleLogin(email, password) {
    try {
        const result = await loginAdmin(email, password);
        if (result.success) {
            localStorage.setItem('adminToken', result.token);
            localStorage.setItem('adminUser', JSON.stringify(result.user));
        }
        return result;
    } catch (err) {
        console.error('Erro no login:', err);
        throw err;
    }
}

export function isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    return !!token;
}

export function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.reload();
}

export function getAuthToken() {
    return localStorage.getItem('adminToken');
}

// =========== FUNÇÕES DO DASHBOARD ===========
export async function fetchDashboardStats(period = 'today') {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getDashboardStats(token, period);
}

export async function fetchRevenueChart(period = 'month') {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getRevenueChart(token, period);
}

export async function fetchPopularityChart() {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getPopularityChart(token);
}

export async function fetchRecentActivity(limit = 10) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getRecentActivity(token, limit);
}

export async function fetchSystemHealth() {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getSystemHealth(token);
}

// =========== FUNÇÕES DE USUÁRIOS ===========
export async function fetchUsers() {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getUsers(token);
}

export async function fetchUserById(userId) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getUserById(userId, token);
}

export async function changeUserBalance(userId, amount, action) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return updateUserBalance(userId, amount, action, token);
}

export async function blockUserById(userId) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return blockUser(userId, token);
}

export async function fetchUserTransactions(userId) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getUserTransactions(userId, token);
}

// =========== FUNÇÕES DE RASPADINHAS ===========
export async function fetchScratchcards() {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getScratchcards(token);
}

export async function createNewScratchcard(data) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return createScratchcard(data, token);
}

export async function editScratchcard(id, data) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return updateScratchcard(id, data, token);
}

export async function deleteScratchcardById(id) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return deleteScratchcard(id, token);
}

export async function fetchScratchcardById(id) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getScratchcardById(id, token);
}

export async function fetchScratchcardPrizes(scratchcardId) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getScratchcardPrizes(scratchcardId, token);
}

export async function createNewPrize(scratchcardId, prizeData) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return createScratchcardPrize(scratchcardId, prizeData, token);
}

export async function editPrize(prizeId, prizeData) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return updateScratchcardPrize(prizeId, prizeData, token);
}

export async function deletePrizeById(prizeId) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return deleteScratchcardPrize(prizeId, token);
}

// =========== FUNÇÕES DE TRANSAÇÕES ===========
export async function fetchTransactions(filters = {}) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getTransactions(token, filters);
}

export async function fetchTransactionById(transactionId) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getTransactionById(transactionId, token);
}

export async function updateTransactionStatusById(transactionId, status) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return updateTransactionStatus(transactionId, status, token);
}

export async function fetchTransactionStats(period = 'today') {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getTransactionStats(token, period);
}

// =========== FUNÇÕES DE ENVIOS ===========
export async function fetchShippings(filters = {}) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getShippings(token, filters);
}

export async function fetchShippingById(shippingId) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getShippingById(shippingId, token);
}

export async function updateShippingStatus(id, status, tracking) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return updateShipping(id, status, tracking, token);
}

export async function createNewShipping(shippingData) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return createShipping(shippingData, token);
}

export async function deleteShippingById(shippingId) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return deleteShipping(shippingId, token);
}

// =========== FUNÇÕES DE CONFIGURAÇÕES ===========
export async function fetchSettings() {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return getSettings(token);
}

export async function saveSettings(data) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return updateSettings(data, token);
}

export async function uploadBanner(file, bannerNumber) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return uploadBannerImage(file, bannerNumber, token);
}

export async function uploadLogo(file) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return uploadLogoImage(file, token);
}

// =========== FUNÇÕES DE IMAGEM ===========
export async function uploadScratchcardImage(file) {
    return uploadImage(file, 'scratchcard');
}

export async function uploadPrizeImage(file) {
    return uploadImage(file, 'prize');
}

export async function deleteImageByUrl(imageUrl) {
    const token = getAuthToken();
    if (!token) throw new Error('Não autorizado');
    return deleteImage(imageUrl, token);
}

export function previewImageFile(input, previewElement) {
    previewImage(input, previewElement);
}

// =========== FUNÇÕES UTILITÁRIAS ===========
export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

export function showNotification(message, type = 'info') {
    // Implementar sistema de notificações
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Exportar todas as funções para uso global
window.app = {
    // Autenticação
    login: handleLogin,
    logout,
    isAuthenticated,
    getAuthToken,
    
    // Dashboard
    fetchDashboardStats,
    fetchRevenueChart,
    fetchPopularityChart,
    fetchRecentActivity,
    fetchSystemHealth,
    
    // Usuários
    fetchUsers,
    fetchUserById,
    changeUserBalance,
    blockUser: blockUserById,
    fetchUserTransactions,
    
    // Raspadinhas
    fetchScratchcards,
    createNewScratchcard,
    editScratchcard,
    deleteScratchcard: deleteScratchcardById,
    fetchScratchcardById,
    fetchScratchcardPrizes,
    createNewPrize,
    editPrize,
    deletePrize: deletePrizeById,
    
    // Transações
    fetchTransactions,
    fetchTransactionById,
    updateTransactionStatus: updateTransactionStatusById,
    fetchTransactionStats,
    
    // Envios
    fetchShippings,
    fetchShippingById,
    updateShippingStatus,
    createNewShipping,
    deleteShipping: deleteShippingById,
    
    // Configurações
    fetchSettings,
    saveSettings,
    uploadBanner,
    uploadLogo,
    
    // Imagens
    uploadScratchcardImage,
    uploadPrizeImage,
    deleteImage: deleteImageByUrl,
    previewImage: previewImageFile,
    
    // Utilitários
    formatCurrency,
    formatDate,
    formatDateTime,
    showNotification
};
