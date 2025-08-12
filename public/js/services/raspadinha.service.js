import { HttpClient } from '../core/http.client.js';
import { API_CONFIG } from '../config/api.config.js';

/**
 * Serviço de Raspadinhas
 * Implementa Clean Architecture - Application Layer
 */
export class RaspadinhaService {
    constructor() {
        this.httpClient = new HttpClient();
    }

    /**
     * Lista todas as raspadinhas disponíveis
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação (opcional)
     * @returns {Promise<Array>} Lista de raspadinhas
     */
    async listRaspadinhas(options = {}) {
        try {
            const response = await this.httpClient.get(
                API_CONFIG.ENDPOINTS.RASPADINHAS.LIST,
                options
            );

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao listar raspadinhas');
            }
        } catch (error) {
            throw this.handleRaspadinhaError(error);
        }
    }

    /**
     * Lista apenas raspadinhas disponíveis para compra
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação (opcional)
     * @returns {Promise<Array>} Lista de raspadinhas disponíveis
     */
    async listAvailableRaspadinhas(options = {}) {
        try {
            const response = await this.httpClient.get(
                API_CONFIG.ENDPOINTS.RASPADINHAS.AVAILABLE,
                options
            );

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao listar raspadinhas disponíveis');
            }
        } catch (error) {
            throw this.handleRaspadinhaError(error);
        }
    }

    /**
     * Obtém uma raspadinha específica por ID
     * @param {string} id - ID da raspadinha
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação (opcional)
     * @returns {Promise<Object>} Dados da raspadinha
     */
    async getRaspadinhaById(id, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.RASPADINHAS.BY_ID.replace(':id', id);
            const response = await this.httpClient.get(endpoint, options);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Raspadinha não encontrada');
            }
        } catch (error) {
            throw this.handleRaspadinhaError(error);
        }
    }

    /**
     * Compra uma raspadinha
     * @param {Object} purchaseData - Dados da compra
     * @param {string} purchaseData.raspadinhaId - ID da raspadinha
     * @param {string} purchaseData.token - Token de autenticação
     * @returns {Promise<Object>} Dados da compra realizada
     */
    async purchaseRaspadinha(purchaseData) {
        try {
            const response = await this.httpClient.post(
                API_CONFIG.ENDPOINTS.PURCHASES.PURCHASE,
                {
                    raspadinhaId: purchaseData.raspadinhaId
                },
                { token: purchaseData.token }
            );

            if (response.success && response.data) {
                // Dispara evento de compra realizada
                window.dispatchEvent(new CustomEvent('raspadinhaPurchased', {
                    detail: { purchase: response.data }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao comprar raspadinha');
            }
        } catch (error) {
            throw this.handlePurchaseError(error);
        }
    }

    /**
     * Raspa uma cartela comprada
     * @param {string} purchaseId - ID da compra
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Resultado da raspagem
     */
    async scratchRaspadinha(purchaseId, options = {}) {
        try {
            const endpoint = API_CONFIG.ENDPOINTS.PURCHASES.SCRATCH.replace(':id', purchaseId);
            const response = await this.httpClient.post(endpoint, null, options);

            if (response.success && response.data) {
                // Dispara evento de raspagem realizada
                window.dispatchEvent(new CustomEvent('raspadinhaScratched', {
                    detail: { result: response.data }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao raspar raspadinha');
            }
        } catch (error) {
            throw this.handleScratchError(error);
        }
    }

    /**
     * Lista as compras do usuário logado
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Array>} Lista de compras do usuário
     */
    async getMyPurchases(options = {}) {
        try {
            const response = await this.httpClient.get(
                API_CONFIG.ENDPOINTS.PURCHASES.MY_PURCHASES,
                options
            );

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao listar compras');
            }
        } catch (error) {
            throw this.handlePurchaseError(error);
        }
    }

    /**
     * Filtra raspadinhas por tipo
     * @param {Array} raspadinhas - Lista de raspadinhas
     * @param {string} type - Tipo da raspadinha (silver, gold, platinum)
     * @returns {Array} Lista filtrada
     */
    filterByType(raspadinhas, type) {
        return raspadinhas.filter(raspadinha => raspadinha.tipo === type);
    }

    /**
     * Filtra raspadinhas por preço
     * @param {Array} raspadinhas - Lista de raspadinhas
     * @param {number} maxPrice - Preço máximo
     * @returns {Array} Lista filtrada
     */
    filterByPrice(raspadinhas, maxPrice) {
        return raspadinhas.filter(raspadinha => raspadinha.preco <= maxPrice);
    }

    /**
     * Filtra raspadinhas por status
     * @param {Array} raspadinhas - Lista de raspadinhas
     * @param {string} status - Status da raspadinha
     * @returns {Array} Lista filtrada
     */
    filterByStatus(raspadinhas, status) {
        return raspadinhas.filter(raspadinha => raspadinha.status === status);
    }

    /**
     * Ordena raspadinhas por preço
     * @param {Array} raspadinhas - Lista de raspadinhas
     * @param {string} order - Ordem (asc ou desc)
     * @returns {Array} Lista ordenada
     */
    sortByPrice(raspadinhas, order = 'asc') {
        return [...raspadinhas].sort((a, b) => {
            if (order === 'asc') {
                return a.preco - b.preco;
            } else {
                return b.preco - a.preco;
            }
        });
    }

    /**
     * Calcula o total gasto em raspadinhas
     * @param {Array} purchases - Lista de compras
     * @returns {number} Total gasto
     */
    calculateTotalSpent(purchases) {
        return purchases.reduce((total, purchase) => {
            return total + (purchase.preco || 0);
        }, 0);
    }

    /**
     * Calcula o total ganho em prêmios
     * @param {Array} purchases - Lista de compras
     * @returns {number} Total ganho
     */
    calculateTotalWon(purchases) {
        return purchases.reduce((total, purchase) => {
            if (purchase.status === 'completed' && purchase.premio) {
                return total + (purchase.premio.valor || 0);
            }
            return total;
        }, 0);
    }

    /**
     * Obtém estatísticas das raspadinhas
     * @param {Array} purchases - Lista de compras
     * @returns {Object} Estatísticas
     */
    getStatistics(purchases) {
        const totalPurchases = purchases.length;
        const completedPurchases = purchases.filter(p => p.status === 'completed').length;
        const totalSpent = this.calculateTotalSpent(purchases);
        const totalWon = this.calculateTotalWon(purchases);
        const profit = totalWon - totalSpent;

        return {
            totalPurchases,
            completedPurchases,
            totalSpent,
            totalWon,
            profit,
            winRate: totalPurchases > 0 ? (completedPurchases / totalPurchases) * 100 : 0
        };
    }

    /**
     * Trata erros específicos de raspadinhas
     * @param {Error} error - Erro original
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handleRaspadinhaError(error) {
        if (error.message.includes('404')) {
            return new Error('Raspadinha não encontrada.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }

        return error;
    }

    /**
     * Trata erros específicos de compra
     * @param {Error} error - Erro original
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handlePurchaseError(error) {
        if (error.message.includes('400')) {
            return new Error('Dados inválidos para a compra. Verifique as informações.');
        }

        if (error.message.includes('402')) {
            return new Error('Saldo insuficiente para realizar a compra.');
        }

        if (error.message.includes('409')) {
            return new Error('Esta raspadinha não está mais disponível.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }

        return error;
    }

    /**
     * Trata erros específicos de raspagem
     * @param {Error} error - Erro original
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handleScratchError(error) {
        if (error.message.includes('400')) {
            return new Error('Esta cartela já foi raspada.');
        }

        if (error.message.includes('404')) {
            return new Error('Compra não encontrada.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }

        return error;
    }
}
