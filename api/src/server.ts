import 'dotenv/config';
import { createApp } from './config/express';
import { Container } from './config/container';

const startServer = async (): Promise<void> => {
  try {
    // Inicializar container de dependências
    const container = new Container();
    
    // Inicializar dados de exemplo (opcional)
    if (process.env.NODE_ENV === 'development') {
      await container.initializeData();
    }

    // Criar aplicação Express
    const app = createApp(container);

    // Configurar porta
    const port = process.env.PORT || 3000;

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API disponível em: http://localhost:${port}/api`);
      console.log(`💚 Health check: http://localhost:${port}/api/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Recebido SIGTERM, encerrando servidor...');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('🛑 Recebido SIGINT, encerrando servidor...');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer(); 