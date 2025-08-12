import { AuthService } from '../services/auth.service.js';
import { RaspadinhaService } from '../services/raspadinha.service.js';
import { UserService } from '../services/user.service.js';

/**
 * Controlador Principal da Aplicação
 * Implementa Clean Architecture - Presentation Layer
 * Coordena os serviços e gerencia o estado da aplicação
 */
export class AppController {
    constructor() {
        this.authService = new AuthService();
        this.raspadinhaService = new RaspadinhaService();
        this.userService = new UserService();

        this.isInitialized = false;
        this.currentUser = null;
        this.raspadinhas = [];
        this.userPurchases = [];

        this.init();
    }

    /**
     * Inicializa o controlador
     */
    async init() {
        try {
            // Verifica se há um usuário logado
            if (this.authService.isAuthenticated()) {
                await this.loadUserData();
                this.setupEventListeners();
                this.updateUI();
            } else {
                this.setupEventListeners();
                this.updateUI();
            }

            this.isInitialized = true;

            // Dispara evento de inicialização
            window.dispatchEvent(new CustomEvent('appInitialized'));

        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            this.handleError(error);
        }
    }

    /**
     * Carrega dados do usuário logado
     */
    async loadUserData() {
        try {
            const token = this.authService.getToken();
            const user = this.authService.getUser();

            if (token && user) {
                this.currentUser = user;

                // Carrega dados adicionais do usuário
                await this.loadUserProfile();
                await this.loadUserPurchases();
                await this.loadAvailableRaspadinhas();
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            this.handleError(error);
        }
    }

    /**
     * Carrega perfil do usuário
     */
    async loadUserProfile() {
        try {
            const token = this.authService.getToken();
            const profile = await this.userService.getProfile({ token });
            this.currentUser = { ...this.currentUser, ...profile };
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }

    /**
     * Carrega compras do usuário
     */
    async loadUserPurchases() {
        try {
            const token = this.authService.getToken();
            this.userPurchases = await this.raspadinhaService.getMyPurchases({ token });
        } catch (error) {
            console.error('Erro ao carregar compras:', error);
        }
    }

    /**
     * Carrega raspadinhas disponíveis
     */
    async loadAvailableRaspadinhas() {
        try {
            this.raspadinhas = await this.raspadinhaService.listAvailableRaspadinhas();
        } catch (error) {
            console.error('Erro ao carregar raspadinhas:', error);
        }
    }

    /**
     * Configura listeners de eventos
     */
    setupEventListeners() {
        // Eventos de autenticação
        window.addEventListener('userLogout', () => this.handleLogout());
        window.addEventListener('balanceUpdated', (event) => this.handleBalanceUpdate(event.detail.balance));

        // Eventos de raspadinhas
        window.addEventListener('raspadinhaPurchased', (event) => this.handleRaspadinhaPurchase(event.detail.purchase));
        window.addEventListener('raspadinhaScratched', (event) => this.handleRaspadinhaScratch(event.detail.result));

        // Eventos de perfil
        window.addEventListener('profileUpdated', (event) => this.handleProfileUpdate(event.detail.profile));
        window.addEventListener('passwordChanged', (event) => this.handlePasswordChange(event.detail.success));
    }

    /**
     * Realiza login do usuário
     * @param {Object} credentials - Credenciais de login
     * @returns {Promise<boolean>} True se o login for bem-sucedido
     */
    async login(credentials) {
        try {
            const result = await this.authService.login(credentials);
            this.currentUser = result.user;

            // Carrega dados adicionais
            await this.loadUserData();
            this.updateUI();

            // Dispara evento de login
            window.dispatchEvent(new CustomEvent('userLogin', { detail: { user: result.user } }));

            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Realiza registro do usuário
     * @param {Object} userData - Dados do usuário
     * @returns {Promise<boolean>} True se o registro for bem-sucedido
     */
    async register(userData) {
        try {
            const result = await this.authService.register(userData);
            this.currentUser = result.user;

            // Carrega dados adicionais
            await this.loadUserData();
            this.updateUI();

            // Dispara evento de registro
            window.dispatchEvent(new CustomEvent('userRegister', { detail: { user: result.user } }));

            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Realiza logout do usuário
     */
    async logout() {
        try {
            this.authService.logout();
            this.currentUser = null;
            this.raspadinhas = [];
            this.userPurchases = [];

            this.updateUI();

            // Dispara evento de logout
            window.dispatchEvent(new CustomEvent('userLogout'));

        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }

    /**
     * Compra uma raspadinha
     * @param {string} raspadinhaId - ID da raspadinha
     * @returns {Promise<boolean>} True se a compra for bem-sucedida
     */
    async purchaseRaspadinha(raspadinhaId) {
        try {
            const token = this.authService.getToken();
            const purchase = await this.raspadinhaService.purchaseRaspadinha({
                raspadinhaId,
                token
            });

            // Atualiza saldo do usuário
            if (purchase.novoSaldo !== undefined) {
                this.authService.updateBalance(purchase.novoSaldo);
            }

            // Adiciona à lista de compras
            this.userPurchases.unshift(purchase);

            this.updateUI();
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Raspa uma cartela comprada
     * @param {string} purchaseId - ID da compra
     * @returns {Promise<boolean>} True se a raspagem for bem-sucedida
     */
    async scratchRaspadinha(purchaseId) {
        try {
            const token = this.authService.getToken();
            const result = await this.raspadinhaService.scratchRaspadinha(purchaseId, { token });

            // Atualiza a compra na lista
            const purchaseIndex = this.userPurchases.findIndex(p => p.id === purchaseId);
            if (purchaseIndex !== -1) {
                this.userPurchases[purchaseIndex] = { ...this.userPurchases[purchaseIndex], ...result };
            }

            // Atualiza saldo se houver prêmio
            if (result.novoSaldo !== undefined) {
                this.authService.updateBalance(result.novoSaldo);
            }

            this.updateUI();
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Atualiza perfil do usuário
     * @param {Object} profileData - Novos dados do perfil
     * @returns {Promise<boolean>} True se a atualização for bem-sucedida
     */
    async updateProfile(profileData) {
        try {
            const token = this.authService.getToken();
            const user = await this.userService.getProfile({ token })
            const updatedProfile = await this.userService.updateProfile(user.id, {
                ...profileData,
                token
            });

            this.currentUser = { ...this.currentUser, ...updatedProfile };
            this.updateUI();

            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Altera senha do usuário
     * @param {Object} passwordData - Dados da senha
     * @returns {Promise<boolean>} True se a alteração for bem-sucedida
     */
    async changePassword(passwordData) {
        try {
            const token = this.authService.getToken();
            await this.userService.changePassword({
                ...passwordData,
                token
            });

            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Atualiza a interface do usuário
     */
    updateUI() {
        // Atualiza estado de autenticação
        const body = document.body;
        if (this.authService.isAuthenticated()) {
            body.classList.remove('logged-out');
            body.classList.add('logged-in');

            // Atualiza informações do usuário
            this.updateUserInfo();
            this.updateRaspadinhasDisplay();
        } else {
            body.classList.remove('logged-in');
            body.classList.add('logged-out');
        }
    }

    /**
     * Atualiza informações do usuário na interface
     */
    updateUserInfo() {
        if (!this.currentUser) return;

        // Atualiza nome do usuário
        const userNameElements = document.querySelectorAll('.user-name-text');
        userNameElements.forEach(el => {
            el.textContent = this.currentUser.name || 'Usuário';
        });

        // Atualiza saldo
        const balanceElements = document.querySelectorAll('.wallet .amount');
        balanceElements.forEach(el => {
            el.textContent = `R$ ${(this.currentUser.saldo || 0).toFixed(2)}`;
        });

        // Atualiza avatar
        const avatarElements = document.querySelectorAll('.user-profile .avatar');
        avatarElements.forEach(el => {
            el.textContent = this.userService.getInitials(this.currentUser.name || 'U');
        });

        //Nome completo
        document.getElementById("name").value = this.currentUser.name || "";

        // Email
        document.getElementById("email").value = this.currentUser.email || "";
    }

    /**
     * Atualiza exibição das raspadinhas
     */
    updateRaspadinhasDisplay() {
        // Implementar lógica para atualizar cards de raspadinhas
        // baseado nos dados carregados da API
    }

    /**
     * Trata eventos de logout
     */
    handleLogout() {
        this.currentUser = null;
        this.raspadinhas = [];
        this.userPurchases = [];
        this.updateUI();
    }

    /**
     * Trata atualizações de saldo
     * @param {number} newBalance - Novo saldo
     */
    handleBalanceUpdate(newBalance) {
        if (this.currentUser) {
            this.currentUser.saldo = newBalance;
            this.updateUserInfo();
        }
    }

    /**
     * Trata compras de raspadinhas
     * @param {Object} purchase - Dados da compra
     */
    handleRaspadinhaPurchase(purchase) {
        this.userPurchases.unshift(purchase);
        this.updateUI();
    }

    /**
     * Trata raspagens de raspadinhas
     * @param {Object} result - Resultado da raspagem
     */
    handleRaspadinhaScratch(result) {
        // Atualiza a compra na lista
        const purchaseIndex = this.userPurchases.findIndex(p => p.id === result.purchaseId);
        if (purchaseIndex !== -1) {
            this.userPurchases[purchaseIndex] = { ...this.userPurchases[purchaseIndex], ...result };
        }

        this.updateUI();
    }

    /**
     * Trata atualizações de perfil
     * @param {Object} profile - Dados do perfil atualizado
     */
    handleProfileUpdate(profile) {
        this.currentUser = { ...this.currentUser, ...profile };
        this.updateUI();
    }

    /**
     * Trata alterações de senha
     * @param {boolean} success - Se a alteração foi bem-sucedida
     */
    handlePasswordChange(success) {
        if (success) {
            // Pode mostrar uma mensagem de sucesso
            console.log('Senha alterada com sucesso');
        }
    }

    /**
     * Trata erros da aplicação
     * @param {Error} error - Erro ocorrido
     */
    handleError(error) {
        console.error('Erro na aplicação:', error);

        // Pode implementar um sistema de notificação de erros
        // ou redirecionar para uma página de erro
    }

    /**
     * Obtém estatísticas do usuário
     * @returns {Object} Estatísticas
     */
    getUserStatistics() {
        return this.raspadinhaService.getStatistics(this.userPurchases);
    }

    /**
     * Verifica se a aplicação está inicializada
     * @returns {boolean} True se estiver inicializada
     */
    isAppInitialized() {
        return this.isInitialized;
    }

    /**
     * Obtém dados do usuário atual
     * @returns {Object|null} Dados do usuário ou null
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Obtém lista de raspadinhas disponíveis
     * @returns {Array} Lista de raspadinhas
     */
    getAvailableRaspadinhas() {
        return this.raspadinhas;
    }

    /**
     * Obtém compras do usuário
     * @returns {Array} Lista de compras
     */
    getUserPurchases() {
        return this.userPurchases;
    }
}
