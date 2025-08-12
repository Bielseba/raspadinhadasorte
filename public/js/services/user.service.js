import { HttpClient } from '../core/http.client.js';
import { API_CONFIG } from '../config/api.config.js';

/**
 * Serviço de Usuário
 * Implementa Clean Architecture - Application Layer
 */
export class UserService {
    constructor() {
        this.httpClient = new HttpClient();
    }

    /**
     * Obtém o perfil do usuário logado
     * @param {Object} options - Opções da requisição
     * @param {string} options.token - Token de autenticação
     * @returns {Promise<Object>} Dados do perfil do usuário
     */
    async getProfile(options = {}) {
        try {
            const response = await this.httpClient.get(
                API_CONFIG.ENDPOINTS.USERS.PROFILE,
                options
            );

            if (response.success && response.data) {
                // Dispara evento de perfil atualizado
                window.dispatchEvent(new CustomEvent('profileUpdated', {
                    detail: { profile: response.data }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao obter perfil');
            }
        } catch (error) {
            throw this.handleUserError(error);
        }
    }

    /**
     * Altera a senha do usuário
     * @param {Object} passwordData - Dados para alteração de senha
     * @param {string} passwordData.currentPassword - Senha atual
     * @param {string} passwordData.newPassword - Nova senha
     * @param {string} passwordData.token - Token de autenticação
     * @returns {Promise<Object>} Resultado da alteração
     */
    async changePassword(passwordData) {
        try {
            const response = await this.httpClient.put(
                API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD,
                {
                    newPassword: passwordData.newPassword
                },
                { token: passwordData.token }
            );

            if (response.success) {
                // Dispara evento de senha alterada
                window.dispatchEvent(new CustomEvent('passwordChanged', {
                    detail: { success: true }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao alterar senha');
            }
        } catch (error) {
            throw this.handlePasswordError(error);
        }
    }

    /**
     * Atualiza dados do perfil do usuário
     * @param {Object} profileData - Novos dados do perfil
     * @param {string} profileData.id - Id do usuario 
     * @param {string} profileData.name - Nome completo
     * @param {string} profileData.phone - Telefone
     * @param {string} profileData.email - Email
     * @param {string} profileData.token - Token de autenticação
     * @returns {Promise<Object>} Perfil atualizado
     */
    async updateProfile(id, profileData) {
        try {
            const response = await this.httpClient.put(
                API_CONFIG.ENDPOINTS.USERS.UPDATE.replace(':id', id),
                {
                    name: profileData.name,
                    phone: profileData.phone,
                    email: profileData.email
                },
                { token: profileData.token }
            );

            if (response.success && response.data) {
                // Dispara evento de perfil atualizado
                window.dispatchEvent(new CustomEvent('profileUpdated', {
                    detail: { profile: response.data }
                }));
                
                return response.data;
            } else {
                throw new Error(response.message || 'Erro ao atualizar perfil');
            }
        } catch (error) {
            throw this.handleUserError(error);
        }
    }

    /**
     * Valida dados do perfil
     * @param {Object} profileData - Dados do perfil
     * @returns {Object} Resultado da validação
     */
    validateProfileData(profileData) {
        const errors = [];

        if (!profileData.nome || profileData.nome.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        if (!profileData.telefone || profileData.telefone.trim().length < 10) {
            errors.push('Telefone deve ter pelo menos 10 dígitos');
        }

        if (!profileData.email || !this.isValidEmail(profileData.email)) {
            errors.push('Email deve ser válido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida dados de alteração de senha
     * @param {Object} passwordData - Dados da senha
     * @returns {Object} Resultado da validação
     */
    validatePasswordData(passwordData) {
        const errors = [];

        if (!passwordData.currentPassword || passwordData.currentPassword.length < 1) {
            errors.push('Senha atual é obrigatória');
        }

        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            errors.push('Nova senha deve ter pelo menos 6 caracteres');
        }

        if (passwordData.newPassword === passwordData.currentPassword) {
            errors.push('Nova senha deve ser diferente da atual');
        }

        if (passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword) {
            errors.push('Confirmação de senha não confere');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida formato de email
     * @param {string} email - Email a ser validado
     * @returns {boolean} True se o email for válido
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida formato de telefone brasileiro
     * @param {string} telefone - Telefone a ser validado
     * @returns {boolean} True se o telefone for válido
     */
    isValidPhone(telefone) {
        // Remove caracteres não numéricos
        const cleanPhone = telefone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    /**
     * Formata telefone para exibição
     * @param {string} telefone - Telefone a ser formatado
     * @returns {string} Telefone formatado
     */
    formatPhone(telefone) {
        const cleanPhone = telefone.replace(/\D/g, '');
        
        if (cleanPhone.length === 11) {
            return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
        } else if (cleanPhone.length === 10) {
            return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
        }
        
        return telefone;
    }

    /**
     * Formata nome para exibição (primeira letra maiúscula)
     * @param {string} nome - Nome a ser formatado
     * @returns {string} Nome formatado
     */
    formatName(nome) {
        return nome
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Obtém iniciais do nome do usuário
     * @param {string} nome - Nome completo
     * @returns {string} Iniciais (ex: "J S" para "João Silva")
     */
    getInitials(nome) {
        return nome
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join(' ')
            .trim();
    }

    /**
     * Calcula idade baseada na data de nascimento
     * @param {string} birthDate - Data de nascimento (YYYY-MM-DD)
     * @returns {number} Idade em anos
     */
    calculateAge(birthDate) {
        if (!birthDate) return null;
        
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    /**
     * Verifica se o usuário é maior de idade
     * @param {string} birthDate - Data de nascimento (YYYY-MM-DD)
     * @returns {boolean} True se for maior de idade
     */
    isAdult(birthDate) {
        const age = this.calculateAge(birthDate);
        return age !== null && age >= 18;
    }

    /**
     * Trata erros específicos de usuário
     * @param {Error} error - Erro original
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handleUserError(error) {
        if (error.message.includes('400')) {
            return new Error('Dados inválidos. Verifique as informações enviadas.');
        }

        if (error.message.includes('401')) {
            return new Error('Sessão expirada. Faça login novamente.');
        }

        if (error.message.includes('404')) {
            return new Error('Usuário não encontrado.');
        }

        if (error.message.includes('409')) {
            return new Error('Email já está em uso por outro usuário.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }

        return error;
    }

    /**
     * Trata erros específicos de alteração de senha
     * @param {Error} error - Erro original
     * @returns {Error} Erro tratado com mensagem amigável
     */
    handlePasswordError(error) {
        if (error.message.includes('400')) {
            return new Error('Senha atual incorreta.');
        }

        if (error.message.includes('401')) {
            return new Error('Sessão expirada. Faça login novamente.');
        }

        if (error.message.includes('422')) {
            return new Error('Nova senha não atende aos requisitos de segurança.');
        }

        if (error.message.includes('Failed to fetch')) {
            return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }

        return error;
    }
}
