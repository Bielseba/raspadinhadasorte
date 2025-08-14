// main.js - Gerenciador principal da interface do painel de administração
import { AdminService } from './services/admin.service.js';

class AdminPanel {
    constructor() {
        this.currentPage = 'dashboard';
        this.isOnline = false;
        this.adminService = new AdminService();
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadInitialData();
    }

    checkAuth() {
        // Em modo offline, sempre mostrar o painel
        if (!window.app || !window.app.isAuthenticated) {
            this.showAdminPanel();
        } else if (!window.app.isAuthenticated()) {
            this.showLoginPage();
        } else {
            this.showAdminPanel();
        }
    }

    showLoginPage() {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('admin-panel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        this.loadDashboardData();
    }

    bindEvents() {
        // Login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // Navegação
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Botões de ação
        this.bindActionButtons();
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="text"]').value;
        const password = form.querySelector('input[type="password"]').value;

        // Em modo offline, simular login bem-sucedido
        if (!window.app || !window.app.login) {
            this.showAdminPanel();
            this.showNotification('Login realizado com sucesso! (Modo Offline)', 'success');
            return;
        }

        try {
            const result = await window.app.login(email, password);
            if (result.success) {
                this.showAdminPanel();
                this.showNotification('Login realizado com sucesso!', 'success');
            } else {
                this.showNotification('Credenciais inválidas', 'error');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    handleLogout() {
        if (window.app && window.app.logout) {
            window.app.logout();
        }
        this.showNotification('Logout realizado com sucesso!', 'info');
        window.location.reload();
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = e.currentTarget.dataset.target;
        this.navigateToPage(target);
    }

    navigateToPage(pageName) {
        // Remove classe ativa de todos os links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Adiciona classe ativa ao link clicado
        const activeLink = document.querySelector(`[data-target="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Esconde todas as páginas
        document.querySelectorAll('.admin-page').forEach(page => {
            page.classList.remove('active');
        });

        // Mostra a página selecionada
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            this.loadPageData(pageName);
        }
    }

    async loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'users':
                await this.loadUsersData();
                break;
            case 'raspadinhas':
                await this.loadRaspadinhasData();
                break;
            case 'transactions':
                await this.loadTransactionsData();
                break;
            case 'settings':
                await this.loadSettingsData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            const token = this.getStoredToken();
            
            // Carrega estatísticas do dashboard
            const stats = await this.adminService.getDashboardStats({ period: 'today', token });
            this.updateDashboardStats(stats);
            
            // Carrega dados de receita
            const revenueData = await this.adminService.getRevenueData({ period: 'month', token });
            this.updateRevenueChart(revenueData);
            
            // Carrega dados de popularidade
            const popularityData = await this.adminService.getPopularityData({ token });
            this.updatePopularityChart(popularityData);
            
            // Carrega atividades recentes
            const recentActivity = await this.adminService.getRecentActivity({ limit: 10, token });
            this.updateRecentActivity(recentActivity);
            
            // Carrega saúde do sistema
            const systemHealth = await this.adminService.getSystemHealth({ token });
            this.updateSystemHealth(systemHealth);
            
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            this.showNotification('Erro ao carregar dados do dashboard', 'error');
        }
    }

    updateDashboardStats(stats) {
        const revenueElement = document.getElementById('dashboard-revenue');
        const newUsersElement = document.getElementById('dashboard-new-users');
        const scratchcardsSoldElement = document.getElementById('dashboard-scratchcards-sold');
        const totalUsersElement = document.getElementById('dashboard-total-users');

        if (revenueElement) revenueElement.textContent = `R$ ${stats.revenue.toFixed(2)}`;
        if (newUsersElement) newUsersElement.textContent = stats.newUsers;
        if (scratchcardsSoldElement) scratchcardsSoldElement.textContent = stats.scratchcardsSold;
        if (totalUsersElement) totalUsersElement.textContent = stats.totalUsers;
    }

    updateRevenueChart(data) {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Receita Mensal',
                    data: data.datasets[0].data,
                    borderColor: data.datasets[0].borderColor,
                    backgroundColor: data.datasets[0].backgroundColor,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#f5f5f5'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#f5f5f5'
                        }
                    }
                }
            }
        });
    }

    updatePopularityChart(data) {
        const ctx = document.getElementById('popularity-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.datasets[0].data,
                    backgroundColor: data.datasets[0].backgroundColor
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f5f5f5',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    updateRecentActivity(activities) {
        const container = document.getElementById('recent-activity-list');
        if (!container) return;

        container.innerHTML = '';
        
        activities.forEach(activity => {
            const activityElement = this.createActivityElement(activity);
            container.appendChild(activityElement);
        });
    }

    createActivityElement(activity) {
        const div = document.createElement('div');
        div.className = 'activity-item';
        
        const icon = this.getActivityIcon(activity.type);
        const timeAgo = this.getTimeAgo(activity.timestamp);
        
        div.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-content">
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${timeAgo}</div>
            </div>
        `;
        
        return div;
    }

    getActivityIcon(type) {
        const icons = {
            'user_registration': '<i class="fas fa-user-plus"></i>',
            'purchase': '<i class="fas fa-shopping-cart"></i>',
            'prize_won': '<i class="fas fa-trophy"></i>',
            'login': '<i class="fas fa-sign-in-alt"></i>'
        };
        return icons[type] || '<i class="fas fa-info-circle"></i>';
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const activityTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Agora mesmo';
        if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
        return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    }

    updateSystemHealth(health) {
        const statusElement = document.getElementById('system-health-status');
        const uptimeElement = document.getElementById('system-uptime');
        const memoryElement = document.getElementById('system-memory');
        const cpuElement = document.getElementById('system-cpu');

        if (statusElement) {
            statusElement.textContent = health.status;
            statusElement.className = `status-badge ${health.status === 'healthy' ? 'success' : 'danger'}`;
        }
        if (uptimeElement) uptimeElement.textContent = health.uptime;
        if (memoryElement) memoryElement.textContent = `${health.memoryUsage}%`;
        if (cpuElement) cpuElement.textContent = `${health.cpuUsage}%`;
    }

    async loadUsersData() {
        try {
            const token = this.getStoredToken();
            const users = await this.adminService.getAllUsers({}, { token });
            this.updateUsersTable(users.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            this.showNotification('Erro ao carregar usuários', 'error');
        }
    }

    updateUsersTable(users) {
        const tbody = document.querySelector('#users-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = this.createUserRow(user);
            tbody.appendChild(row);
        });
    }

    createUserRow(user) {
        const row = document.createElement('tr');
        
        const statusClass = user.status === 'active' ? 'success' : 'danger';
        const statusText = user.status === 'active' ? 'Ativo' : 'Bloqueado';
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>R$ ${user.balance.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
            <td class="action-buttons">
                <button onclick="adminPanel.editUser('${user.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="adminPanel.toggleUserBlock('${user.id}', ${!user.blocked})" title="${user.blocked ? 'Desbloquear' : 'Bloquear'}">
                    <i class="fas fa-${user.blocked ? 'unlock' : 'lock'}"></i>
                </button>
                <button onclick="adminPanel.viewUserTransactions('${user.id}')" title="Ver Transações">
                    <i class="fas fa-list"></i>
                </button>
            </td>
        `;
        
        return row;
    }

    async editUser(userId) {
        try {
            const token = this.getStoredToken();
            const user = await this.adminService.getUserById(userId, { token });
            
            // Preenche modal de edição
            document.getElementById('edit-user-id').value = user.id;
            document.getElementById('edit-user-name').value = user.name;
            document.getElementById('edit-user-email').value = user.email;
            document.getElementById('edit-user-balance').value = user.balance;
            
            // Mostra modal
            document.getElementById('edit-user-modal').style.display = 'flex';
            
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            this.showNotification('Erro ao carregar dados do usuário', 'error');
        }
    }

    async toggleUserBlock(userId, blocked) {
        try {
            const token = this.getStoredToken();
            const reason = blocked ? 'Usuário bloqueado pelo administrador' : 'Usuário desbloqueado pelo administrador';
            
            await this.adminService.toggleUserBlock(userId, {
                blocked,
                reason,
                token
            });
            
            this.showNotification(`Usuário ${blocked ? 'bloqueado' : 'desbloqueado'} com sucesso`, 'success');
            
            // Recarrega dados
            await this.loadUsersData();
            
        } catch (error) {
            console.error('Erro ao alterar status do usuário:', error);
            this.showNotification('Erro ao alterar status do usuário', 'error');
        }
    }

    async viewUserTransactions(userId) {
        try {
            const token = this.getStoredToken();
            const transactions = await this.adminService.getUserTransactions(userId, {}, { token });
            
            // Preenche modal de transações
            this.updateUserTransactionsModal(transactions.data, userId);
            
            // Mostra modal
            document.getElementById('user-transactions-modal').style.display = 'flex';
            
        } catch (error) {
            console.error('Erro ao carregar transações do usuário:', error);
            this.showNotification('Erro ao carregar transações do usuário', 'error');
        }
    }

    updateUserTransactionsModal(transactions, userId) {
        const container = document.getElementById('user-transactions-list');
        const title = document.getElementById('user-transactions-title');
        
        if (title) title.textContent = `Transações do Usuário ${userId}`;
        if (!container) return;
        
        container.innerHTML = '';
        
        if (transactions.length === 0) {
            container.innerHTML = '<p>Nenhuma transação encontrada</p>';
            return;
        }
        
        transactions.forEach(transaction => {
            const transactionElement = this.createTransactionElement(transaction);
            container.appendChild(transactionElement);
        });
    }

    createTransactionElement(transaction) {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        
        const typeClass = transaction.type === 'deposit' ? 'positive' : 
                         transaction.type === 'withdrawal' ? 'negative' : 'neutral';
        
        div.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-type ${typeClass}">${this.getTransactionTypeLabel(transaction.type)}</span>
                <span class="transaction-amount ${typeClass}">R$ ${transaction.amount.toFixed(2)}</span>
            </div>
            <div class="transaction-details">
                <span class="transaction-date">${new Date(transaction.createdAt).toLocaleDateString('pt-BR')}</span>
                <span class="transaction-status">${transaction.status}</span>
            </div>
        `;
        
        return div;
    }

    getTransactionTypeLabel(type) {
        const labels = {
            'deposit': 'Depósito',
            'withdrawal': 'Saque',
            'transfer': 'Transferência',
            'purchase': 'Compra',
            'refund': 'Reembolso'
        };
        return labels[type] || type;
    }

    async loadRaspadinhasData() {
        try {
            const token = this.getStoredToken();
            const raspadinhas = await this.adminService.getAllRaspadinhas({}, { token });
            this.updateRaspadinhasTable(raspadinhas.data);
        } catch (error) {
            console.error('Erro ao carregar raspadinhas:', error);
            this.showNotification('Erro ao carregar raspadinhas', 'error');
        }
    }

    updateRaspadinhasTable(raspadinhas) {
        const tbody = document.querySelector('#raspadinhas-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        raspadinhas.forEach(raspadinha => {
            const row = this.createRaspadinhaRow(raspadinha);
            tbody.appendChild(row);
        });
    }

    createRaspadinhaRow(raspadinha) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${raspadinha.name}</td>
            <td>R$ ${raspadinha.price.toFixed(2)}</td>
            <td>${raspadinha.prize}</td>
            <td><span class="color-preview" style="background-color: ${raspadinha.color}"></span></td>
            <td>${raspadinha.active ? 'Ativa' : 'Inativa'}</td>
            <td>${new Date(raspadinha.createdAt).toLocaleDateString('pt-BR')}</td>
            <td class="action-buttons">
                <button onclick="adminPanel.editRaspadinha('${raspadinha.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="adminPanel.deleteRaspadinha('${raspadinha.id}')" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        return row;
    }

    async loadTransactionsData() {
        try {
            const token = this.getStoredToken();
            const transactions = await this.adminService.getAllTransactions({}, { token });
            this.updateTransactionsTable(transactions.data);
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            this.showNotification('Erro ao carregar transações', 'error');
        }
    }

    updateTransactionsTable(transactions) {
        const tbody = document.querySelector('#transactions-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        transactions.forEach(transaction => {
            const row = this.createTransactionRow(transaction);
            tbody.appendChild(row);
        });
    }

    createTransactionRow(transaction) {
        const row = document.createElement('tr');
        
        const statusClass = transaction.status === 'completed' ? 'success' : 
                           transaction.status === 'pending' ? 'warning' : 'danger';
        
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.userId}</td>
            <td>${this.getTransactionTypeLabel(transaction.type)}</td>
            <td>R$ ${transaction.amount.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${transaction.status}</span></td>
            <td>${new Date(transaction.createdAt).toLocaleDateString('pt-BR')}</td>
            <td class="action-buttons">
                <button onclick="adminPanel.viewTransaction('${transaction.id}')" title="Ver Detalhes">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="adminPanel.updateTransactionStatus('${transaction.id}')" title="Alterar Status">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        
        return row;
    }

    async loadSettingsData() {
        try {
            const token = this.getStoredToken();
            const settings = await this.adminService.getSiteSettings({ token });
            this.updateSettingsForm(settings);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            this.showNotification('Erro ao carregar configurações', 'error');
        }
    }

    updateSettingsForm(settings) {
        if (document.getElementById('site-name')) document.getElementById('site-name').value = settings.siteName || '';
        if (document.getElementById('logo-url')) document.getElementById('logo-url').value = settings.logo || '';
        if (document.getElementById('primary-color')) document.getElementById('primary-color').value = settings.primaryColor || '';
        if (document.getElementById('banner-1-url')) document.getElementById('banner-1-url').value = settings.banners?.[0] || '';
        if (document.getElementById('banner-2-url')) document.getElementById('banner-2-url').value = settings.banners?.[1] || '';
        if (document.getElementById('banner-3-url')) document.getElementById('banner-3-url').value = settings.banners?.[2] || '';
    }

    bindActionButtons() {
        // Botões de fechar modal
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) modal.style.display = 'none';
            });
        });

        // Formulário de criar raspadinha
        const createRaspadinhaForm = document.getElementById('create-raspadinha-form');
        if (createRaspadinhaForm) {
            createRaspadinhaForm.addEventListener('submit', this.handleCreateRaspadinha.bind(this));
        }

        // Formulário de editar raspadinha
        const editRaspadinhaForm = document.getElementById('edit-raspadinha-form');
        if (editRaspadinhaForm) {
            editRaspadinhaForm.addEventListener('submit', this.handleEditRaspadinha.bind(this));
        }

        // Formulário de configurações
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', this.handleUpdateSettings.bind(this));
        }
    }

    async handleCreateRaspadinha(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            const token = this.getStoredToken();
            const raspadinhaData = {
                name: formData.get('sc-name'),
                price: parseFloat(formData.get('sc-price')),
                prize: formData.get('sc-prize'),
                color: formData.get('sc-color'),
                image: formData.get('sc-image'),
                token
            };
            
            await this.adminService.createRaspadinha(raspadinhaData);
            
            this.showNotification('Raspadinha criada com sucesso!', 'success');
            form.reset();
            document.getElementById('create-raspadinha-modal').style.display = 'none';
            
            // Recarrega dados
            await this.loadRaspadinhasData();
            
        } catch (error) {
            console.error('Erro ao criar raspadinha:', error);
            this.showNotification('Erro ao criar raspadinha', 'error');
        }
    }

    async handleEditRaspadinha(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const raspadinhaId = formData.get('sc-id');
        
        try {
            const token = this.getStoredToken();
            const raspadinhaData = {
                name: formData.get('sc-name'),
                price: parseFloat(formData.get('sc-price')),
                prize: formData.get('sc-prize'),
                color: formData.get('sc-color'),
                image: formData.get('sc-image'),
                token
            };
            
            await this.adminService.updateRaspadinha(raspadinhaId, raspadinhaData);
            
            this.showNotification('Raspadinha atualizada com sucesso!', 'success');
            document.getElementById('edit-raspadinha-modal').style.display = 'none';
            
            // Recarrega dados
            await this.loadRaspadinhasData();
            
        } catch (error) {
            console.error('Erro ao atualizar raspadinha:', error);
            this.showNotification('Erro ao atualizar raspadinha', 'error');
        }
    }

    async handleUpdateSettings(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            const token = this.getStoredToken();
            const settingsData = {
                siteName: formData.get('site-name'),
                logo: formData.get('logo-url'),
                primaryColor: formData.get('primary-color'),
                banners: [
                    formData.get('banner-1-url'),
                    formData.get('banner-2-url'),
                    formData.get('banner-3-url')
                ],
                token
            };
            
            await this.adminService.updateSiteSettings(settingsData);
            
            this.showNotification('Configurações atualizadas com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao atualizar configurações:', error);
            this.showNotification('Erro ao atualizar configurações', 'error');
        }
    }

    async deleteRaspadinha(raspadinhaId) {
        if (!confirm('Tem certeza que deseja deletar esta raspadinha?')) return;
        
        try {
            const token = this.getStoredToken();
            await this.adminService.deleteRaspadinha(raspadinhaId, { token });
            
            this.showNotification('Raspadinha deletada com sucesso!', 'success');
            
            // Recarrega dados
            await this.loadRaspadinhasData();
            
        } catch (error) {
            console.error('Erro ao deletar raspadinha:', error);
            this.showNotification('Erro ao deletar raspadinha', 'error');
        }
    }

    getStoredToken() {
        return localStorage.getItem('auth_token');
    }

    showNotification(message, type = 'info') {
        // Implementar sistema de notificação
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Pode ser implementado com toast ou modal
        alert(`${type.toUpperCase()}: ${message}`);
    }

    loadInitialData() {
        // Carrega dados iniciais se necessário
    }
}

// Inicializa o painel admin
const adminPanel = new AdminPanel();
window.adminPanel = adminPanel;
