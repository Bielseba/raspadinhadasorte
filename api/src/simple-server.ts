import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota de exemplo
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Estrutura SOLID criada com sucesso!',
    endpoints: [
      'GET /api/health - Health check',
      'POST /api/auth/login - Login',
      'GET /api/raspadinhas - Listar raspadinhas',
      'POST /api/purchases/purchase - Comprar raspadinha'
    ]
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor teste rodando na porta ${PORT}`);
  console.log(`🔗 Teste: http://localhost:${PORT}/api/health`);
  console.log(`📖 Info: http://localhost:${PORT}/api/test`);
});

export default app; 