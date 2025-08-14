import { HttpClient } from '../../js/core/http.client.js';
import { API_CONFIG } from '../../js/config/api.config.js';

/**
 * Serviço de Administração
 * Implementa Clean Architecture - Application Layer
 */
export class AdminService {
    constructor() {
        this.httpClient = new HttpClient();
    }

    /**
     * Obtém estatísticas do dashboard
     * @param {Object} options - Opções da requisição
     * @param {string} options.period - Período (today, week, month, year)
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Estatísticas do dashboard
     */
    async getDashboardStats(options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD.STATS;
            const queryParams = new URLSearchParams();
            
            if (options.period) queryParams.append('period', options.period);
            
            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter estatísticas do dashboard');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém dados de receita para gráficos
     * @param {Object} options - Opções da requisição
     * @param {string} options.period - Período (month, year)
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Dados de receita
     */
    async getRevenueData(options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD.REVENUE;
            const queryParams = new URLSearchParams();
            
            if (options.period) queryParams.append('period', options.period);
            
            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter dados de receita');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém dados de popularidade para gráficos
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Dados de popularidade
     */
    async getPopularityData(options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD.POPULARITY;
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter dados de popularidade');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém atividades recentes
     * @param {Object} options - Opções da requisição
     * @param {number} options.limit - Limite de atividades
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Array>} Lista de atividades recentes
     */
    async getRecentActivity(options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD.RECENT_ACTIVITY;
            const queryParams = new URLSearchParams();
            
            if (options.limit) queryParams.append('limit', options.limit);
            
            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter atividades recentes');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém saúde do sistema
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Status de saúde do sistema
     */
    async getSystemHealth(options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD.SYSTEM_HEALTH;
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter saúde do sistema');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Lista todos os usuários
     * @param {Object} filters - Filtros para usuários
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Lista de usuários
     */
    async getAllUsers(filters = {}, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.USERS.LIST;
            const queryParams = new URLSearchParams();
            
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.limit) queryParams.append('limit', filters.limit);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.search) queryParams.append('search', filters.search);

            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao listar usuários');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém usuário específico
     * @param {string} userId - ID do usuário
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Dados do usuário
     */
    async getUserById(userId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.USERS.BY_ID.replace(':id', userId);
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter usuário');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Atualiza saldo do usuário
     * @param {string} userId - ID do usuário
     * @param {Object} balanceData - Dados do saldo
     * @param {number} balanceData.amount - Novo saldo
     * @param {string} balanceData.description - Descrição da alteração
     * @param {string} balanceData.token - Token de autenticação
     * @returns {Promise<Object>} Resultado da atualização
     */
    async updateUserBalance(userId, balanceData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.USERS.UPDATE_BALANCE.replace(':id', userId);
            const response = await this.httpClient.put(endpoint, {
                amount: balanceData.amount,
                description: balanceData.description
            }, { token: balanceData.token });

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao atualizar saldo');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Bloqueia/desbloqueia usuário
     * @param {string} userId - ID do usuário
     * @param {Object} blockData - Dados do bloqueio
     * @param {boolean} blockData.blocked - Status do bloqueio
     * @param {string} blockData.reason - Motivo do bloqueio
     * @param {string} blockData.token - Token de autenticação
     * @returns {Promise<Object>} Resultado da operação
     */
    async toggleUserBlock(userId, blockData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.USERS.TOGGLE_BLOCK.replace(':id', userId);
            const response = await this.httpClient.put(endpoint, {
                blocked: blockData.blocked,
                reason: blockData.reason
            }, { token: blockData.token });

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao alterar status do usuário');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém transações de usuário específico
     * @param {string} userId - ID do usuário
     * @param {Object} filters - Filtros para transações
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Lista de transações
     */
    async getUserTransactions(userId, filters = {}, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.USERS.TRANSACTIONS.replace(':userId', userId);
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
                throw new Error(response.message || 'Erro ao obter transações do usuário');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Lista todas as raspadinhas
     * @param {Object} filters - Filtros para raspadinhas
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Lista de raspadinhas
     */
    async getAllRaspadinhas(filters = {}, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.RASPADINHAS.LIST;
            const queryParams = new URLSearchParams();
            
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.limit) queryParams.append('limit', filters.limit);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.type) queryParams.append('type', filters.type);

            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao listar raspadinhas');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Cria nova raspadinha
     * @param {Object} raspadinhaData - Dados da raspadinha
     * @param {string} raspadinhaData.name - Nome da raspadinha
     * @param {number} raspadinhaData.price - Preço
     * @param {string} raspadinhaData.prize - Prêmio
     * @param {string} raspadinhaData.color - Cor
     * @param {string} raspadinhaData.image - URL da imagem
     * @param {string} raspadinhaData.token - Token de autenticação
     * @returns {Promise<Object>} Raspadinha criada
     */
    async createRaspadinha(raspadinhaData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.RASPADINHAS.CREATE;
            const response = await this.httpClient.post(endpoint, {
                name: raspadinhaData.name,
                price: raspadinhaData.price,
                prize: raspadinhaData.prize,
                color: raspadinhaData.color,
                image: raspadinhaData.image
            }, { token: raspadinhaData.token });

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao criar raspadinha');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Atualiza raspadinha existente
     * @param {string} raspadinhaId - ID da raspadinha
     * @param {Object} raspadinhaData - Novos dados
     * @param {string} raspadinhaData.token - Token de autenticação
     * @returns {Promise<Object>} Raspadinha atualizada
     */
    async updateRaspadinha(raspadinhaId, raspadinhaData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.RASPADINHAS.UPDATE.replace(':id', raspadinhaId);
            const response = await this.httpClient.put(endpoint, raspadinhaData, { token: raspadinhaData.token });

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao atualizar raspadinha');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Deleta raspadinha
     * @param {string} raspadinhaId - ID da raspadinha
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Resultado da operação
     */
    async deleteRaspadinha(raspadinhaId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.RASPADINHAS.DELETE.replace(':id', raspadinhaId);
            const response = await this.httpClient.delete(endpoint, options);

            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao deletar raspadinha');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Lista todas as transações
     * @param {Object} filters - Filtros para transações
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Lista de transações
     */
    async getAllTransactions(filters = {}, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.TRANSACTIONS.LIST;
            const queryParams = new URLSearchParams();
            
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.limit) queryParams.append('limit', filters.limit);
            if (filters.userId) queryParams.append('userId', filters.userId);
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao listar transações');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém transação específica
     * @param {string} transactionId - ID da transação
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Dados da transação
     */
    async getTransactionById(transactionId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.TRANSACTIONS.BY_ID.replace(':id', transactionId);
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter transação');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Atualiza status da transação
     * @param {string} transactionId - ID da transação
     * @param {Object} statusData - Dados do status
     * @param {string} statusData.status - Novo status
     * @param {string} statusData.reason - Motivo da alteração
     * @param {string} statusData.token - Token de autenticação
     * @returns {Promise<Object>} Transação atualizada
     */
    async updateTransactionStatus(transactionId, statusData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.TRANSACTIONS.UPDATE_STATUS.replace(':id', transactionId);
            const response = await this.httpClient.put(endpoint, {
                status: statusData.status,
                reason: statusData.reason
            }, { token: statusData.token });

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao atualizar status da transação');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém estatísticas das transações
     * @param {Object} options - Opções da requisição
     * @param {string} options.period - Período (today, week, month, year)
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Estatísticas das transações
     */
    async getTransactionStats(options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.TRANSACTIONS.STATS;
            const queryParams = new URLSearchParams();
            
            if (options.period) queryParams.append('period', options.period);
            
            const fullEndpoint = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;
            const response = await this.httpClient.get(fullEndpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter estatísticas das transações');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Obtém configurações do site
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Configurações do site
     */
    async getSiteSettings(options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.SETTINGS.GET;
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter configurações');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Atualiza configurações do site
     * @param {Object} settingsData - Novas configurações
     * @param {string} settingsData.token - Token de autenticação
     * @returns {Promise<Object>} Configurações atualizadas
     */
    async updateSiteSettings(settingsData) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.SETTINGS.UPDATE;
            const response = await this.httpClient.put(endpoint, settingsData, { token: settingsData.token });

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao atualizar configurações');
            }
        } catch (error) {
            throw this.handleAdminError(error);
        }
    }

    /**
     * Faz upload de imagem
     * @param {FormData} formData - Dados do formulário com a imagem
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Resultado do upload
     */
    async uploadImage(formData, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.ADMIN.UPLOAD.IMAGE;
            const token = options.token || this.getStoredToken();
            
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro no upload da imagem');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            throw this.handleAdminError(error);
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
     * Trata erros específicos de administração
     * @param {Error} error - Erro original
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handleAdminError(error) {
        if (error.message.includes('400')) {
            return new Error('Dados inválidos. Verifique as informações enviadas.');
        }

        if (error.message.includes('401')) {
            return new Error('Sessão expirada. Faça login novamente.');
        }

        if (error.message.includes('403')) {
            return new Error('Acesso negado. Você não tem permissão para esta operação.');
        }

        if (error.message.includes('404')) {
            return new Error('Recurso não encontrado.');
        }

        if (error.message.includes('409')) {
            return new Error('Conflito. O recurso já existe ou está em uso.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }

        return error;
    }
}
