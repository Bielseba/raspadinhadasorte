import { API_CONFIG } from '../config/api.config.js';

/**
 * Utilitários para requisições HTTP
 */
export class HttpUtils {
    /**
     * Cria um timeout para requisições
     * @param {number} ms - Milissegundos para timeout
     * @returns {Promise} Promise que rejeita após o timeout
     */
    static createTimeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
        });
    }

    /**
     * Executa uma requisição com retry automático
     * @param {Function} requestFn - Função que executa a requisição
     * @param {number} maxAttempts - Número máximo de tentativas
     * @returns {Promise} Promise com o resultado da requisição
     */
    static async withRetry(requestFn, maxAttempts = API_CONFIG.RETRY_ATTEMPTS) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await requestFn();
            } catch (error) {
                lastError = error;
                
                // Se não for o último attempt, aguarda antes de tentar novamente
                if (attempt < maxAttempts) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Valida se uma resposta HTTP é bem-sucedida
     * @param {Response} response - Objeto Response do fetch
     * @returns {Response} Response se for bem-sucedida
     * @throws {Error} Erro se a resposta não for bem-sucedida
     */
    static validateResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        return response;
    }

    /**
     * Processa a resposta JSON de uma requisição
     * @param {Response} response - Objeto Response do fetch
     * @returns {Promise<Object>} Dados da resposta
     */
    static async processJsonResponse(response) {
        try {
            return await response.json();
        } catch (error) {
            throw new Error(`Failed to parse JSON response: ${error.message}`);
        }
    }

    /**
     * Cria headers para requisições autenticadas
     * @param {string} token - Token JWT
     * @returns {Object} Headers com autorização
     */
    static createAuthHeaders(token) {
        return {
            ...API_CONFIG.HEADERS,
            'Authorization': `Bearer ${token}`
        };
    }

    /**
     * Log de requisições (apenas em desenvolvimento)
     * @param {string} method - Método HTTP
     * @param {string} url - URL da requisição
     * @param {Object} data - Dados da requisição (opcional)
     */
    static logRequest(method, url, data = null) {
        if (window.location.hostname === 'localhost') {
            console.log(`🌐 ${method.toUpperCase()} ${url}`, data ? data : '');
        }
    }

    /**
     * Log de respostas (apenas em desenvolvimento)
     * @param {string} method - Método HTTP
     * @param {string} url - URL da requisição
     * @param {Object} response - Resposta da API
     */
    static logResponse(method, url, response) {
        if (window.location.hostname === 'localhost') {
            console.log(`✅ ${method.toUpperCase()} ${url}`, response);
        }
    }

    /**
     * Log de erros (apenas em desenvolvimento)
     * @param {string} method - Método HTTP
     * @param {string} url - URL da requisição
     * @param {Error} error - Erro ocorrido
     */
    static logError(method, url, error) {
        if (window.location.hostname === 'localhost') {
            console.error(`❌ ${method.toUpperCase()} ${url}`, error);
        }
    }
}
