// Configurações da API
export const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            VALIDATE_TOKEN: '/auth/validate-token',
            REFRESH_TOKEN: '/auth/refresh-token',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
            LOGOUT: '/auth/logout'
        },
        USERS: {
            PROFILE: '/users/profile',
            UPDATE: '/users/profile/:id',
            CHANGE_PASSWORD: '/users/change-password',
            ME: '/users/me',
            DELETE_ME: '/users/me'
        },
        WALLET: {
            BALANCE: '/users/:userId/balance',
            DEPOSIT: '/users/:userId/deposit',
            WITHDRAW: '/users/:userId/withdraw',
            TRANSFER: '/users/:userId/transfer',
            STATS: '/users/:userId/stats',
            TRANSACTIONS: '/users/:userId/transactions'
        },
        TRANSACTIONS: {
            RECENT: '/users/:userId/transactions/recent',
            BY_ID: '/users/:userId/transactions/:transactionId',
            EXPORT: '/users/:userId/transactions/export',
            MONTHLY_SUMMARY: '/users/:userId/transactions/monthly-summary',
            CATEGORIES: '/users/:userId/transactions/categories'
        },
        RASPADINHAS: {
            LIST: '/raspadinhas',
            AVAILABLE: '/raspadinhas/available',
            BY_ID: '/raspadinhas/:id',
            FEATURED: '/raspadinhas/featured',
            SEARCH: '/raspadinhas/search',
            CATEGORIES: '/raspadinhas/categories',
            PRICE_RANGE: '/raspadinhas/price-range',
            STATISTICS: '/raspadinhas/statistics'
        },
        PURCHASES: {
            PURCHASE: '/purchases/purchase',
            SCRATCH: '/purchases/:id/scratch',
            MY_PURCHASES: '/purchases/my-purchases',
            DETAILS: '/purchases/:id/details',
            CANCEL: '/purchases/:id/cancel',
            PRIZE: '/purchases/:id/prize',
            STATISTICS: '/purchases/statistics'
        },
        ADMIN: {
            DASHBOARD: {
                STATS: '/admin/dashboard/stats',
                REVENUE: '/admin/dashboard/revenue',
                POPULARITY: '/admin/dashboard/popularity',
                RECENT_ACTIVITY: '/admin/dashboard/recent-activity',
                SYSTEM_HEALTH: '/admin/dashboard/system-health'
            },
            USERS: {
                LIST: '/admin/users',
                BY_ID: '/admin/users/:id',
                UPDATE_BALANCE: '/admin/users/:id/balance',
                TOGGLE_BLOCK: '/admin/users/:id/block',
                TRANSACTIONS: '/admin/users/:userId/transactions'
            },
            RASPADINHAS: {
                LIST: '/admin/raspadinhas',
                CREATE: '/admin/raspadinhas',
                BY_ID: '/admin/raspadinhas/:id',
                UPDATE: '/admin/raspadinhas/:id',
                DELETE: '/admin/raspadinhas/:id'
            },
            TRANSACTIONS: {
                LIST: '/admin/transactions',
                BY_ID: '/admin/transactions/:id',
                UPDATE_STATUS: '/admin/transactions/:id/status',
                STATS: '/admin/transactions/stats'
            },
            SETTINGS: {
                GET: '/admin/settings',
                UPDATE: '/admin/settings'
            },
            UPLOAD: {
                IMAGE: '/admin/upload-image',
                BANNER: '/admin/upload-banner',
                LOGO: '/admin/upload-logo'
            }
        },
        NOTIFICATIONS: {
            LIST: '/notifications',
            READ: '/notifications/:id/read',
            DELETE: '/notifications/:id',
            BROADCAST: '/admin/notifications/broadcast'
        },
        REPORTS: {
            SALES: '/reports/sales',
            USERS: '/reports/users',
            PRIZES: '/reports/prizes',
            FINANCIAL: '/reports/financial'
        },
        SEARCH: {
            GLOBAL: '/search',
            USERS: '/search/users',
            TRANSACTIONS: '/search/transactions'
        },
        WEBHOOKS: {
            PAYMENT: '/webhooks/payment',
            NOTIFICATION: '/webhooks/notification'
        }
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3
};

// Configurações de ambiente
export const ENV_CONFIG = {
    IS_DEVELOPMENT: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    IS_PRODUCTION: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};
