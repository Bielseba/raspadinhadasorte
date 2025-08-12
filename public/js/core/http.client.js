import { API_CONFIG } from '../config/api.config.js';
import { HttpUtils } from '../utils/http.utils.js';

/**
 * Cliente HTTP base para todas as requisições da API
 * Implementa Clean Architecture - Infrastructure Layer
 */
export class HttpClient {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * Executa uma requisição HTTP com timeout e retry
     * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
     * @param {string} endpoint - Endpoint da API
     * @param {Object} options - Opções da requisição
     * @returns {Promise<Object>} Resposta da API
     */
    async request(method, endpoint, options = {}) {
        const url = this.buildUrl(endpoint);
        const requestOptions = this.buildRequestOptions(method, options);

        HttpUtils.logRequest(method, url, options.body);

        try {
            const response = await HttpUtils.withRetry(async () => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                try {
                    const response = await fetch(url, {
                        ...requestOptions,
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    return response;
                } catch (error) {
                    clearTimeout(timeoutId);
                    throw error;
                }
            });

            const validatedResponse = HttpUtils.validateResponse(response);
            const data = await HttpUtils.processJsonResponse(validatedResponse);

            HttpUtils.logResponse(method, url, data);
            return data;

        } catch (error) {
            HttpUtils.logError(method, url, error);
            throw this.handleError(error);
        }
    }

    /**
     * Constrói a URL completa para a requisição
     * @param {string} endpoint - Endpoint da API
     * @returns {string} URL completa
     */
    buildUrl(endpoint) {
        // Remove barra inicial se existir
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        return `${this.baseUrl}/${cleanEndpoint}`;
    }

    /**
     * Constrói as opções da requisição
     * @param {string} method - Método HTTP
     * @param {Object} options - Opções customizadas
     * @returns {Object} Opções da requisição
     */
    buildRequestOptions(method, options) {
        const defaultOptions = {
            method: method.toUpperCase(),
            headers: { ...API_CONFIG.HEADERS },
            ...options
        };

        // Adiciona headers de autorização se o token estiver disponível
        if (options.token) {
            defaultOptions.headers = HttpUtils.createAuthHeaders(options.token);
        }

        // Remove propriedades customizadas que não são do fetch
        delete defaultOptions.token;
        delete defaultOptions.retryAttempts;

        return defaultOptions;
    }

    /**
     * Trata erros da requisição
     * @param {Error} error - Erro ocorrido
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handleError(error) {
        if (error.name === 'AbortError') {
            return new Error('A requisição demorou muito para responder. Tente novamente.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Não foi possível conectar com o servidor. Verifique sua conexão.');
        }

        if (error.message.includes('HTTP error!')) {
            const statusMatch = error.message.match(/status: (\d+)/);
            if (statusMatch) {
                const status = parseInt(statusMatch[1]);
                return this.getHttpErrorMessage(status, error.message);
            }
        }

        return error;
    }

    /**
     * Retorna mensagens de erro amigáveis baseadas no status HTTP
     * @param {number} status - Status HTTP
     * @param {string} originalMessage - Mensagem original do erro
     * @returns {Error} Erro com mensagem amigável
     */
    getHttpErrorMessage(status, originalMessage) {
        switch (status) {
            case 400:
                return new Error('Dados inválidos. Verifique as informações enviadas.');
            case 401:
                return new Error('Sessão expirada. Faça login novamente.');
            case 403:
                return new Error('Acesso negado. Você não tem permissão para esta ação.');
            case 404:
                return new Error('Recurso não encontrado.');
            case 409:
                return new Error('Conflito de dados. Verifique as informações.');
            case 422:
                return new Error('Dados inválidos. Verifique o formato das informações.');
            case 429:
                return new Error('Muitas requisições. Aguarde um momento antes de tentar novamente.');
            case 500:
                return new Error('Erro interno do servidor. Tente novamente mais tarde.');
            case 502:
            case 503:
            case 504:
                return new Error('Serviço temporariamente indisponível. Tente novamente em alguns minutos.');
            default:
                return new Error(`Erro inesperado (${status}). Tente novamente.`);
        }
    }

    // Métodos HTTP específicos para facilitar o uso
    async get(endpoint, options = {}) {
        return this.request('GET', endpoint, options);
    }

    async post(endpoint, data = null, options = {}) {
        return this.request('POST', endpoint, {
            ...options,
            body: data ? JSON.stringify(data) : undefined
        });
    }

    async put(endpoint, data = null, options = {}) {
        return this.request('PUT', endpoint, {
            ...options,
            body: data ? JSON.stringify(data) : undefined
        });
    }

    async delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, options);
    }

    async patch(endpoint, data = null, options = {}) {
        return this.request('PATCH', endpoint, {
            ...options,
            body: data ? JSON.stringify(data) : undefined
        });
    }
}
