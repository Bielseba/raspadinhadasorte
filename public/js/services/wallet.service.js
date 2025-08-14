import { HttpClient } from '../core/http.client.js';
import { API_CONFIG } from '../config/api.config.js';

/**
 * Serviço de Carteira e Transações
 * Implementa Clean Architecture - Application Layer
 */
export class WalletService {
    constructor() {
        this.httpClient = new HttpClient();
    }

    /**
     * Obtém o saldo da carteira do usuário
     * @param {string} userId - ID do usuário
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Dados do saldo
     */
    async getBalance(userId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.WALLET.BALANCE.replace(':userId', userId);
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                // Dispara evento de saldo atualizado
                window.dispatchEvent(new CustomEvent('balanceUpdated', {
                    detail: { balance: response.data.balance }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter saldo');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Deposita dinheiro na carteira
     * @param {string} userId - ID do usuário
     * @param {Object} depositData - Dados do depósito
     * @param {number} depositData.amount - Valor a depositar
     * @param {string} depositData.description - Descrição do depósito
     * @param {string} depositData.token - Token de autenticação
     * @returns {Promise<Object>} Resultado do depósito
     */
    async deposit(userId, depositData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.WALLET.DEPOSIT.replace(':userId', userId);
            const response = await this.httpClient.post(endpoint, {
                amount: depositData.amount,
                description: depositData.description
            }, { token: depositData.token });

            if (response.success && response.data) {
                // Dispara evento de depósito realizado
                window.dispatchEvent(new CustomEvent('depositCompleted', {
                    detail: { 
                        amount: depositData.amount,
                        newBalance: response.data.balance 
                    }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao realizar depósito');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Saca dinheiro da carteira
     * @param {string} userId - ID do usuário
     * @param {Object} withdrawData - Dados do saque
     * @param {number} withdrawData.amount - Valor a sacar
     * @param {string} withdrawData.description - Descrição do saque
     * @param {string} withdrawData.token - Token de autenticação
     * @returns {Promise<Object>} Resultado do saque
     */
    async withdraw(userId, withdrawData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.WALLET.WITHDRAW.replace(':userId', userId);
            const response = await this.httpClient.post(endpoint, {
                amount: withdrawData.amount,
                description: withdrawData.description
            }, { token: withdrawData.token });

            if (response.success && response.data) {
                // Dispara evento de saque realizado
                window.dispatchEvent(new CustomEvent('withdrawCompleted', {
                    detail: { 
                        amount: withdrawData.amount,
                        newBalance: response.data.balance 
                    }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao realizar saque');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Transfere dinheiro para outro usuário
     * @param {string} userId - ID do usuário origem
     * @param {Object} transferData - Dados da transferência
     * @param {string} transferData.targetUserId - ID do usuário destino
     * @param {number} transferData.amount - Valor a transferir
     * @param {string} transferData.description - Descrição da transferência
     * @param {string} transferData.token - Token de autenticação
     * @returns {Promise<Object>} Resultado da transferência
     */
    async transfer(userId, transferData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.WALLET.TRANSFER.replace(':userId', userId);
            const response = await this.httpClient.post(endpoint, {
                targetUserId: transferData.targetUserId,
                amount: transferData.amount,
                description: transferData.description
            }, { token: transferData.token });

            if (response.success && response.data) {
                // Dispara evento de transferência realizada
                window.dispatchEvent(new CustomEvent('transferCompleted', {
                    detail: { 
                        amount: transferData.amount,
                        targetUserId: transferData.targetUserId,
                        newBalance: response.data.sourceBalance 
                    }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao realizar transferência');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Obtém estatísticas pessoais da carteira
     * @param {string} userId - ID do usuário
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Estatísticas da carteira
     */
    async getPersonalStats(userId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.WALLET.STATS.replace(':userId', userId);
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter estatísticas');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Obtém histórico de transações
     * @param {string} userId - ID do usuário
     * @param {Object} filters - Filtros para as transações
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Histórico de transações
     */
    async getTransactionHistory(userId, filters = {}, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.WALLET.TRANSACTIONS.replace(':userId', userId);
            const queryParams = new URLSearchParams();
            
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.limit) queryParams.append('limit', filters.limit);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter histórico de transações');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Obtém transações recentes
     * @param {string} userId - ID do usuário
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @param {number} options.limit - Limite de transações (padrão: 10)
     * @returns {Promise<Array>} Lista de transações recentes
     */
    async getRecentTransactions(userId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.TRANSACTIONS.RECENT.replace(':userId', userId);
            const queryParams = new URLSearchParams();
            
            if (options.limit) queryParams.append('limit', options.limit);
            
            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter transações recentes');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Obtém transação específica
     * @param {string} userId - ID do usuário
     * @param {string} transactionId - ID da transação
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Dados da transação
     */
    async getTransaction(userId, transactionId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.TRANSACTIONS.BY_ID
                .replace(':userId', userId)
                .replace(':transactionId', transactionId);
            
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter transação');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Exporta transações
     * @param {string} userId - ID do usuário
     * @param {Object} exportOptions - Opções de exportação
     * @param {string} exportOptions.format - Formato (csv)
     * @param {string} exportOptions.startDate - Data de início
     * @param {string} exportOptions.endDate - Data de fim
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Blob>} Arquivo para download
     */
    async exportTransactions(userId, exportOptions = {}, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.TRANSACTIONS.EXPORT.replace(':userId', userId);
            const queryParams = new URLSearchParams();
            
            if (exportOptions.format) queryParams.append('format', exportOptions.format);
            if (exportOptions.startDate) queryParams.append('startDate', exportOptions.startDate);
            if (exportOptions.endDate) queryParams.append('endDate', exportOptions.endDate);

            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            
            // Para download de arquivo, usamos fetch diretamente
            const token = options.token || this.getStoredToken();
            const response = await fetch(`${API_CONFIG.BASE_URL}${fullEndpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'text/csv'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao exportar transações');
            }

            return await response.blob();
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Obtém resumo mensal de transações
     * @param {string} userId - ID do usuário
     * @param {Object} dateOptions - Opções de data
     * @param {number} dateOptions.year - Ano
     * @param {number} dateOptions.month - Mês
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Resumo mensal
     */
    async getMonthlySummary(userId, dateOptions = {}, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.TRANSACTIONS.MONTHLY_SUMMARY.replace(':userId', userId);
            const queryParams = new URLSearchParams();
            
            if (dateOptions.year) queryParams.append('year', dateOptions.year);
            if (dateOptions.month) queryParams.append('month', dateOptions.month);

            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter resumo mensal');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Obtém categorias de transações
     * @param {string} userId - ID do usuário
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Array>} Lista de categorias
     */
    async getTransactionCategories(userId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.TRANSACTIONS.CATEGORIES.replace(':userId', userId);
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter categorias');
            }
        } catch (error) {
            throw this.handleWalletError(error);
        }
    }

    /**
     * Obtém token armazenado
     * @returns {string|null} Token ou null
     */
    getStoredToken() {
        return localStorage.getItem('auth_token');
    }

    /**
     * Trata erros específicos de carteira
     * @param {Error} error - Erro original
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handleWalletError(error) {
        if (error.message.includes('400')) {
            return new Error('Dados inválidos. Verifique as informações enviadas.');
        }

        if (error.message.includes('401')) {
            return new Error('Sessão expirada. Faça login novamente.');
        }

        if (error.message.includes('402')) {
            return new Error('Saldo insuficiente para realizar a operação.');
        }

        if (error.message.includes('403')) {
            return new Error('Acesso negado. Você não tem permissão para esta operação.');
        }

        if (error.message.includes('404')) {
            return new Error('Carteira ou transação não encontrada.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }

        return error;
    }
}
