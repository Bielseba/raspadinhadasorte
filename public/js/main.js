import { AppController } from './controllers/app.controller.js';
import { WalletService } from './services/wallet.service.js';

// Inicializa serviços
window.app = new AppController();
window.walletService = new WalletService();

// Toast utilitário
const toast = document.getElementById('toast-notification');
function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, duration);
}

// --- LOGIN ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        try {
            const success = await window.app.login({ email, password });
            if (success) {
                hideModal();
                showToast('Bem-vindo de volta à sua conta.');
                // Carrega dados da carteira após login
                loadUserWalletData();
            } else {
                showToast('Falha no login. Verifique seus dados.');
            }
        } catch (err) {
            showToast(err.message || 'Erro ao fazer login.');
        }
    });
}

// --- REGISTRO ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const name = document.getElementById('reg-nome').value;
        const phone = document.getElementById('reg-tel').value;
        const senha = document.getElementById('reg-senha').value;
        const senhaRep = document.getElementById('reg-senha-rep').value;
        if (senha.length < 6) return showToast('A senha deve ter pelo menos 6 caracteres.');
        if (senha !== senhaRep) return showToast('As senhas não coincidem. Tente novamente.');
        try {
            const success = await window.app.register({ email, name, phone, password: senha });
            if (success) {
                hideModal();
                showToast('Cadastro realizado com sucesso! Bem-vindo.');
                // Carrega dados da carteira após registro
                loadUserWalletData();
            } else {
                showToast('Falha no cadastro. Verifique seus dados.');
            }
        } catch (err) {
            showToast(err.message || 'Erro ao registrar.');
        }
    });
}

// --- LOGOUT ---
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await window.app.logout();
        showToast('Você saiu da sua conta.');
        // Limpa dados da carteira
        clearWalletData();
    });
}

// --- FUNCIONALIDADES DE CARTEIRA ---

// Carrega dados da carteira do usuário
async function loadUserWalletData() {
    if (!window.app.isAuthenticated()) return;
    
    try {
        const userId = window.app.getUserId();
        const token = window.app.getToken();
        
        // Carrega saldo
        const balanceData = await window.walletService.getBalance(userId, { token });
        updateBalanceDisplay(balanceData.balance);
        
        // Carrega transações recentes
        const recentTransactions = await window.walletService.getRecentTransactions(userId, { token, limit: 5 });
        updateRecentTransactionsDisplay(recentTransactions);
        
        // Carrega estatísticas
        const stats = await window.walletService.getPersonalStats(userId, { token });
        updateStatsDisplay(stats);
        
    } catch (error) {
        console.error('Erro ao carregar dados da carteira:', error);
        showToast('Erro ao carregar dados da carteira.');
    }
}

// Atualiza exibição do saldo
function updateBalanceDisplay(balance) {
    const balanceElements = document.querySelectorAll('.user-balance, .balance-amount');
    balanceElements.forEach(element => {
        element.textContent = `R$ ${balance.toFixed(2)}`;
    });
}

// Atualiza exibição das transações recentes
function updateRecentTransactionsDisplay(transactions) {
    const container = document.getElementById('recent-transactions');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (transactions.length === 0) {
        container.innerHTML = '<p class="no-transactions">Nenhuma transação encontrada</p>';
        return;
    }
    
    transactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        container.appendChild(transactionElement);
    });
}

// Cria elemento de transação
function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    const typeClass = transaction.type === 'deposit' ? 'positive' : 
                     transaction.type === 'withdrawal' ? 'negative' : 'neutral';
    
    div.innerHTML = `
        <div class="transaction-info">
            <span class="transaction-type ${typeClass}">${getTransactionTypeLabel(transaction.type)}</span>
            <span class="transaction-amount ${typeClass}">R$ ${transaction.amount.toFixed(2)}</span>
        </div>
        <div class="transaction-details">
            <span class="transaction-date">${formatDate(transaction.createdAt)}</span>
            <span class="transaction-description">${transaction.description || 'Sem descrição'}</span>
        </div>
    `;
    
    return div;
}

// Obtém label do tipo de transação
function getTransactionTypeLabel(type) {
    const labels = {
        'deposit': 'Depósito',
        'withdrawal': 'Saque',
        'transfer': 'Transferência',
        'purchase': 'Compra',
        'refund': 'Reembolso'
    };
    return labels[type] || type;
}

// Formata data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Atualiza exibição das estatísticas
function updateStatsDisplay(stats) {
    const statsContainer = document.getElementById('user-stats');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Total de Depósitos</span>
            <span class="stat-value">R$ ${stats.totalDeposits.toFixed(2)}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total de Saques</span>
            <span class="stat-value">R$ ${stats.totalWithdrawals.toFixed(2)}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total de Transações</span>
            <span class="stat-value">${stats.totalTransactions}</span>
        </div>
    `;
}

// Limpa dados da carteira
function clearWalletData() {
    updateBalanceDisplay(0);
    updateRecentTransactionsDisplay([]);
    updateStatsDisplay({
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalTransactions: 0
    });
}

// --- DEPÓSITO ---
const depositForm = document.getElementById('deposit-form');
if (depositForm) {
    depositForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        const description = document.getElementById('deposit-description').value;
        
        if (!amount || amount <= 0) {
            showToast('Valor inválido para depósito.');
            return;
        }
        
        try {
            const userId = window.app.getUserId();
            const token = window.app.getToken();
            
            const result = await window.walletService.deposit(userId, {
                amount,
                description,
                token
            });
            
            showToast('Depósito realizado com sucesso!');
            depositForm.reset();
            
            // Atualiza dados da carteira
            await loadUserWalletData();
            
        } catch (error) {
            showToast(error.message || 'Erro ao realizar depósito.');
        }
    });
}

// --- SAQUE ---
const withdrawForm = document.getElementById('withdraw-form');
if (withdrawForm) {
    withdrawForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const description = document.getElementById('withdraw-description').value;
        
        if (!amount || amount <= 0) {
            showToast('Valor inválido para saque.');
            return;
        }
        
        try {
            const userId = window.app.getUserId();
            const token = window.app.getToken();
            
            const result = await window.walletService.withdraw(userId, {
                amount,
                description,
                token
            });
            
            showToast('Saque realizado com sucesso!');
            withdrawForm.reset();
            
            // Atualiza dados da carteira
            await loadUserWalletData();
            
        } catch (error) {
            showToast(error.message || 'Erro ao realizar saque.');
        }
    });
}

// --- TRANSFERÊNCIA ---
const transferForm = document.getElementById('transfer-form');
if (transferForm) {
    transferForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const targetUserId = document.getElementById('transfer-target-user').value;
        const amount = parseFloat(document.getElementById('transfer-amount').value);
        const description = document.getElementById('transfer-description').value;
        
        if (!targetUserId || !amount || amount <= 0) {
            showToast('Dados inválidos para transferência.');
            return;
        }
        
        try {
            const userId = window.app.getUserId();
            const token = window.app.getToken();
            
            const result = await window.walletService.transfer(userId, {
                targetUserId,
                amount,
                description,
                token
            });
            
            showToast('Transferência realizada com sucesso!');
            transferForm.reset();
            
            // Atualiza dados da carteira
            await loadUserWalletData();
            
        } catch (error) {
            showToast(error.message || 'Erro ao realizar transferência.');
        }
    });
}

// --- COMPRA DE RASPADINHA ---
let selectedCardId = null;
const allScratchCards = document.querySelectorAll('.scratch-card');
allScratchCards.forEach(cardEl => cardEl.addEventListener('click', () => {
    selectedCardId = cardEl.dataset.cardId;
    // Aqui você pode chamar window.app.getAvailableRaspadinhas() se quiser atualizar info
}));

const btnBuyScratchcard = document.getElementById('btn-buy-scratchcard');
const lockedOverlay = document.getElementById('game-locked-overlay');
if (btnBuyScratchcard) {
    btnBuyScratchcard.onclick = async () => {
        if (!selectedCardId) return showToast('Selecione uma raspadinha.');
        const success = await window.app.purchaseRaspadinha(selectedCardId);
        if (success) {
            lockedOverlay.classList.add('hidden');
            showToast('Raspadinha comprada com sucesso!');
            // Atualiza dados da carteira após compra
            await loadUserWalletData();
        } else {
            showToast('Erro ao comprar raspadinha.');
        }
    };
}

// --- RASPAGEM DE CARTELA ---
// Exemplo: supondo que você tenha um botão para raspar (adicione o id btn-scratch se necessário)
// const btnScratch = document.getElementById('btn-scratch');
// if (btnScratch) {
//     btnScratch.onclick = async () => {
//         const purchaseId = ... // obter id da compra
//         const success = await window.app.scratchRaspadinha(purchaseId);
//         if (success) {
//             showToast('Boa sorte! Veja seu prêmio.');
//         } else {
//             showToast('Erro ao raspar cartela.');
//         }
//     };
// }

// --- ATUALIZAÇÃO DE PERFIL ---
const btnSaveProfile = document.querySelector('.settings-form .btn-save');
if (btnSaveProfile) {
    btnSaveProfile.onclick = async () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        // Adapte para pegar telefone se necessário
        const success = await window.app.updateProfile({ name, email });
        if (success) {
            showToast('Perfil atualizado!');
        } else {
            showToast('Erro ao atualizar perfil.');
        }
    };
}

// --- ALTERAÇÃO DE SENHA ---
const btnChangePassword = document.querySelectorAll('.settings-form .btn-save')[1];
if (btnChangePassword) {
    btnChangePassword.onclick = async () => {
        const currentPassword = document.getElementById('current-pw').value;
        const newPassword = document.getElementById('new-pw').value;
        const success = await window.app.changePassword({ currentPassword, newPassword });
        if (success) {
            showToast('Senha alterada com sucesso!');
        } else {
            showToast('Erro ao alterar senha.');
        }
    };
}

// --- EXPORTAÇÃO DE TRANSAÇÕES ---
const exportTransactionsBtn = document.getElementById('export-transactions-btn');
if (exportTransactionsBtn) {
    exportTransactionsBtn.addEventListener('click', async () => {
        try {
            const userId = window.app.getUserId();
            const token = window.app.getToken();
            
            const blob = await window.walletService.exportTransactions(userId, {
                format: 'csv',
                startDate: document.getElementById('export-start-date')?.value,
                endDate: document.getElementById('export-end-date')?.value
            }, { token });
            
            // Cria link para download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showToast('Transações exportadas com sucesso!');
            
        } catch (error) {
            showToast(error.message || 'Erro ao exportar transações.');
        }
    });
}

// --- HISTÓRICO DE TRANSAÇÕES ---
const loadMoreTransactionsBtn = document.getElementById('load-more-transactions');
if (loadMoreTransactionsBtn) {
    loadMoreTransactionsBtn.addEventListener('click', async () => {
        try {
            const userId = window.app.getUserId();
            const token = window.app.getToken();
            
            // Implementar paginação aqui
            const currentPage = parseInt(loadMoreTransactionsBtn.dataset.page) || 1;
            const nextPage = currentPage + 1;
            
            const transactions = await window.walletService.getTransactionHistory(userId, {
                page: nextPage,
                limit: 20
            }, { token });
            
            // Adiciona novas transações à lista existente
            const container = document.getElementById('transactions-list');
            transactions.data.forEach(transaction => {
                const transactionElement = createTransactionElement(transaction);
                container.appendChild(transactionElement);
            });
            
            // Atualiza página atual
            loadMoreTransactionsBtn.dataset.page = nextPage;
            
            // Esconde botão se não há mais transações
            if (transactions.data.length < 20) {
                loadMoreTransactionsBtn.style.display = 'none';
            }
            
        } catch (error) {
            showToast(error.message || 'Erro ao carregar mais transações.');
        }
    });
}

// --- EVENTOS DE CARTEIRA ---
window.addEventListener('balanceUpdated', (event) => {
    updateBalanceDisplay(event.detail.balance);
});

window.addEventListener('depositCompleted', (event) => {
    showToast(`Depósito de R$ ${event.detail.amount.toFixed(2)} realizado com sucesso!`);
});

window.addEventListener('withdrawCompleted', (event) => {
    showToast(`Saque de R$ ${event.detail.amount.toFixed(2)} realizado com sucesso!`);
});

window.addEventListener('transferCompleted', (event) => {
    showToast(`Transferência de R$ ${event.detail.amount.toFixed(2)} realizada com sucesso!`);
});

// --- MODAL E NAVEGAÇÃO SPA (mantém o que já existe, mas pode chamar window.app.updateUI() se necessário) ---
// ... existing code ...
// Você pode adicionar outros handlers conforme necessário

// Funções utilitárias para modal (copiadas do script antigo)
const mainSiteContainer = document.getElementById('main-site-container');
const authModal = document.getElementById('auth-modal');
const registerStep1 = document.getElementById('register-step-1');
const registerStep2 = document.getElementById('register-step-2');

function hideModal() {
    mainSiteContainer.classList.remove('blurred');
    authModal.classList.remove('visible');
}

// Carrega dados da carteira quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    if (window.app.isAuthenticated()) {
        loadUserWalletData();
    }
});

// Carrega dados da carteira quando o usuário faz login
window.addEventListener('userLogin', () => {
    loadUserWalletData();
});

// Limpa dados da carteira quando o usuário faz logout
window.addEventListener('userLogout', () => {
    clearWalletData();
});