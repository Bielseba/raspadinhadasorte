// Configurações da API
export const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            VALIDATE_TOKEN: '/auth/validate-token'
        },
        USERS: {
            PROFILE: '/users/profile',
            UPDATE: '/users/profile/:id',
            CHANGE_PASSWORD: '/users/change-password'
        },
        RASPADINHAS: {
            LIST: '/raspadinhas',
            AVAILABLE: '/raspadinhas/available',
            BY_ID: '/raspadinhas/:id'
        },
        PURCHASES: {
            PURCHASE: '/purchases/purchase',
            SCRATCH: '/purchases/:id/scratch',
            MY_PURCHASES: '/purchases/my-purchases'
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
