import { HttpClient } from '../core/http.client.js';
import { API_CONFIG } from '../config/api.config.js';

/**
 * Serviço de Autenticação
 * Implementa Clean Architecture - Application Layer
 */
export class AuthService {
    constructor() {
        this.httpClient = new HttpClient();
        this.tokenKey = 'auth_token';
        this.userKey = 'user_data';
    }

    /**
     * Realiza login do usuário
     * @param {Object} credentials - Credenciais de login
     * @param {string} credentials.email - Email do usuário
     * @param {string} credentials.password - Senha do usuário
     * @returns {Promise<Object>} Dados do usuário logado
     */
    async login(credentials) {
        try {
            const response = await this.httpClient.post(
                API_CONFIG.ENDPOINTS.AUTH.LOGIN,
                credentials
            );

            if (response.success && response.data) {
                this.saveToken(response.data.token);
                this.saveUser(response.data.user);
                return response.data;
            } else {
                throw new Error(response.message || 'Erro no login');
            }
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Realiza registro do usuário
     * @param {Object} userData - Dados do usuário
     * @param {string} userData.name - Nome completo
     * @param {string} userData.phone - Telefone
     * @param {string} userData.email - Email
     * @param {string} userData.senha - Senha
     * @returns {Promise<Object>} Dados do usuário registrado
     */
    async register(userData) {
        try {
            const response = await this.httpClient.post(
                API_CONFIG.ENDPOINTS.AUTH.REGISTER,
                userData
            );

            if (response.success && response.data) {
                this.saveToken(response.data.token);
                this.saveUser(response.data.user);
                return response.data;
            } else {
                throw new Error(response.message || 'Erro no registro');
            }
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    /**
     * Valida o token atual
     * @returns {Promise<boolean>} True se o token for válido
     */
    async validateToken() {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        try {
            const response = await this.httpClient.post(
                API_CONFIG.ENDPOINTS.AUTH.VALIDATE_TOKEN,
                { token },
                { token }
            );

            return response.success === true;
        } catch (error) {
            this.logout();
            return false;
        }
    }

    /**
     * Verifica se o usuário está autenticado
     * @returns {boolean} True se estiver autenticado
     */
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    }

    /**
     * Obtém o token armazenado
     * @returns {string|null} Token JWT ou null
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Obtém os dados do usuário armazenados
     * @returns {Object|null} Dados do usuário ou null
     */
    getUser() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Obtém o ID do usuário logado
     * @returns {string|null} ID do usuário ou null
     */
    getUserId() {
        const user = this.getUser();
        return user ? user.id : null;
    }

    /**
     * Obtém o nome do usuário logado
     * @returns {string|null} Nome do usuário ou null
     */
    getUserName() {
        const user = this.getUser();
        return user ? user.nome : null;
    }

    /**
     * Obtém o email do usuário logado
     * @returns {string|null} Email do usuário ou null
     */
    getUserEmail() {
        const user = this.getUser();
        return user ? user.email : null;
    }

    /**
     * Obtém o saldo do usuário logado
     * @returns {number} Saldo do usuário (0 se não logado)
     */
    getUserBalance() {
        const user = this.getUser();
        return user ? (user.saldo || 0) : 0;
    }

    /**
     * Obtém o role do usuário logado
     * @returns {string} Role do usuário ('user' por padrão)
     */
    getUserRole() {
        const user = this.getUser();
        return user ? (user.role || 'user') : 'user';
    }

    /**
     * Verifica se o usuário é admin
     * @returns {boolean} True se for admin
     */
    isAdmin() {
        return this.getUserRole() === 'admin';
    }

    /**
     * Atualiza os dados do usuário em memória
     * @param {Object} userData - Novos dados do usuário
     */
    updateUserData(userData) {
        const currentUser = this.getUser();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            this.saveUser(updatedUser);
        }
    }

    /**
     * Realiza logout do usuário
     */
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        
        // Dispara evento de logout para notificar outros componentes
        window.dispatchEvent(new CustomEvent('userLogout'));
    }

    /**
     * Salva o token no localStorage
     * @param {string} token - Token JWT
     */
    saveToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Salva os dados do usuário no localStorage
     * @param {Object} user - Dados do usuário
     */
    saveUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    /**
     * Trata erros específicos de autenticação
     * @param {Error} error - Erro original
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handleAuthError(error) {
        if (error.message.includes('401')) {
            return new Error('Email ou senha incorretos. Tente novamente.');
        }

        if (error.message.includes('409')) {
            return new Error('Este email já está cadastrado. Use outro email ou faça login.');
        }

        if (error.message.includes('422')) {
            return new Error('Dados inválidos. Verifique as informações e tente novamente.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }

        return error;
    }

    /**
     * Atualiza o saldo do usuário
     * @param {number} newBalance - Novo saldo
     */
    updateBalance(newBalance) {
        this.updateUserData({ saldo: newBalance });
        
        // Dispara evento de atualização de saldo
        window.dispatchEvent(new CustomEvent('balanceUpdated', {
            detail: { balance: newBalance }
        }));
    }

    /**
     * Obtém headers de autorização para requisições
     * @returns {Object} Headers com token de autorização
     */
    getAuthHeaders() {
        const token = this.getToken();
        return token ? { token } : {};
    }
}
