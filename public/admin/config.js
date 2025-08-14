// config.js - Configurações centralizadas
export const CONFIG = {
    // URL base da API (ajuste conforme necessário)
    API_BASE_URL: 'http://localhost:3000/api',
    
    // Configurações de upload
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    },
    
    // Configurações de autenticação
    AUTH: {
        TOKEN_KEY: 'adminToken',
        USER_KEY: 'adminUser'
    },
    
    // Configurações da interface
    UI: {
        NOTIFICATION_DURATION: 3000, // 3 segundos
        CHART_COLORS: {
            primary: '#f5b942',
            success: '#1db954',
            danger: '#e53935',
            warning: '#f39c12',
            info: '#3a7bd5'
        }
    }
};
