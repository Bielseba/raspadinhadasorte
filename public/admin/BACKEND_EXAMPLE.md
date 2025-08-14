# Exemplo de Implementação do Backend

Este arquivo contém exemplos de como implementar o backend para as rotas da API do painel de administração.

## Estrutura do Projeto

```
backend/
├── package.json
├── .env
├── server.js
├── middlewares/
│   ├── auth.js
│   └── upload.js
├── routes/
│   ├── admin.js
│   ├── dashboard.js
│   ├── users.js
│   ├── scratchcards.js
│   ├── transactions.js
│   ├── shippings.js
│   ├── settings.js
│   └── uploads.js
├── controllers/
│   ├── dashboardController.js
│   ├── userController.js
│   ├── scratchcardController.js
│   ├── transactionController.js
│   ├── shippingController.js
│   ├── settingsController.js
│   └── uploadController.js
├── models/
│   ├── User.js
│   ├── Scratchcard.js
│   ├── Prize.js
│   ├── Transaction.js
│   ├── Shipping.js
│   └── Settings.js
└── uploads/
    ├── scratchcards/
    ├── prizes/
    ├── banners/
    └── logos/
```

## Dependências (package.json)

```json
{
  "name": "raspadinha-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.6.0",
    "sequelize": "^6.32.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Configuração do Servidor (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/dashboard', require('./routes/dashboard'));
app.use('/api/admin/users', require('./routes/users'));
app.use('/api/admin/scratchcards', require('./routes/scratchcards'));
app.use('/api/admin/transactions', require('./routes/transactions'));
app.use('/api/admin/shippings', require('./routes/shippings'));
app.use('/api/admin/settings', require('./routes/settings'));
app.use('/api/admin/upload', require('./routes/uploads'));

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: true, 
    message: 'Erro interno do servidor' 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

## Middleware de Autenticação (middlewares/auth.js)

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: true, 
        message: 'Token não fornecido' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: true, 
      message: 'Token inválido' 
    });
  }
};

module.exports = authMiddleware;
```

## Middleware de Upload (middlewares/upload.js)

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (req.path.includes('banner')) {
      uploadPath += 'banners/';
    } else if (req.path.includes('logo')) {
      uploadPath += 'logos/';
    } else if (req.path.includes('prize')) {
      uploadPath += 'prizes/';
    } else {
      uploadPath += 'scratchcards/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

module.exports = upload;
```

## Rotas do Dashboard (routes/dashboard.js)

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardController');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Estatísticas do dashboard
router.get('/stats', dashboardController.getStats);

// Dados do gráfico de receita
router.get('/revenue', dashboardController.getRevenueChart);

// Dados do gráfico de popularidade
router.get('/popularity', dashboardController.getPopularityChart);

// Atividades recentes
router.get('/recent-activity', dashboardController.getRecentActivity);

// Saúde do sistema
router.get('/system-health', dashboardController.getSystemHealth);

module.exports = router;
```

## Controlador do Dashboard (controllers/dashboardController.js)

```javascript
const { User, Transaction, Scratchcard } = require('../models');

class DashboardController {
  // Buscar estatísticas do dashboard
  async getStats(req, res) {
    try {
      const period = req.query.period || 'today';
      const startDate = this.getStartDate(period);
      
      // Estatísticas de usuários
      const totalUsers = await User.count();
      const newUsers = await User.count({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        }
      });
      
      // Estatísticas de transações
      const revenue = await Transaction.sum('amount', {
        where: {
          type: 'deposit',
          status: 'completed',
          createdAt: {
            [Op.gte]: startDate
          }
        }
      });
      
      // Estatísticas de raspadinhas
      const scratchcardsSold = await Scratchcard.count({
        where: {
          sold: true,
          soldAt: {
            [Op.gte]: startDate
          }
        }
      });
      
      res.json({
        success: true,
        data: {
          revenue: revenue || 0,
          newUsers,
          scratchcardsSold,
          totalUsers,
          period
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar estatísticas' 
      });
    }
  }
  
  // Dados do gráfico de receita
  async getRevenueChart(req, res) {
    try {
      const period = req.query.period || 'month';
      const startDate = this.getStartDate(period);
      
      // Buscar dados de receita por período
      const revenueData = await Transaction.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'total']
        ],
        where: {
          type: 'deposit',
          status: 'completed',
          createdAt: {
            [Op.gte]: startDate
          }
        },
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
      });
      
      const labels = revenueData.map(item => item.getDataValue('date'));
      const data = revenueData.map(item => parseFloat(item.getDataValue('total')));
      
      res.json({
        success: true,
        data: {
          labels,
          datasets: [{
            label: 'Receita',
            data,
            borderColor: '#f5b942',
            backgroundColor: 'rgba(245, 185, 66, 0.1)',
            tension: 0.4
          }]
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados de receita:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar dados de receita' 
      });
    }
  }
  
  // Dados do gráfico de popularidade
  async getPopularityChart(req, res) {
    try {
      // Buscar popularidade das raspadinhas
      const popularityData = await Scratchcard.findAll({
        attributes: [
          'name',
          [sequelize.fn('COUNT', sequelize.col('sales.id')), 'salesCount']
        ],
        include: [{
          model: Sale,
          as: 'sales',
          attributes: []
        }],
        group: ['Scratchcard.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('sales.id')), 'DESC']],
        limit: 5
      });
      
      const labels = popularityData.map(item => item.name);
      const data = popularityData.map(item => parseInt(item.getDataValue('salesCount')));
      
      res.json({
        success: true,
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#4a90e2', '#c84a8a', '#555', '#f5b942', '#1db954']
          }]
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados de popularidade:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar dados de popularidade' 
      });
    }
  }
  
  // Atividades recentes
  async getRecentActivity(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      // Buscar atividades recentes (exemplo simplificado)
      const activities = await Transaction.findAll({
        include: [{
          model: User,
          attributes: ['id', 'name']
        }],
        order: [['createdAt', 'DESC']],
        limit
      });
      
      const formattedActivities = activities.map(transaction => ({
        id: transaction.id,
        type: 'transaction',
        description: `Transação ${transaction.type} de ${transaction.amount}`,
        timestamp: transaction.createdAt,
        details: {
          userId: transaction.User.id,
          userName: transaction.User.name,
          amount: transaction.amount,
          type: transaction.type
        }
      }));
      
      res.json({
        success: true,
        data: formattedActivities
      });
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar atividades recentes' 
      });
    }
  }
  
  // Saúde do sistema
  async getSystemHealth(req, res) {
    try {
      // Verificar conectividade do banco
      const dbStatus = await this.checkDatabaseHealth();
      
      // Verificar espaço em disco
      const diskStatus = await this.checkDiskSpace();
      
      // Verificar uso de memória
      const memoryStatus = this.checkMemoryUsage();
      
      res.json({
        success: true,
        data: {
          database: dbStatus,
          disk: diskStatus,
          memory: memoryStatus,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Erro ao verificar saúde do sistema:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao verificar saúde do sistema' 
      });
    }
  }
  
  // Métodos auxiliares
  getStartDate(period) {
    const now = new Date();
    switch (period) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
  }
  
  async checkDatabaseHealth() {
    try {
      await sequelize.authenticate();
      return { status: 'healthy', message: 'Conexão OK' };
    } catch (error) {
      return { status: 'unhealthy', message: error.message };
    }
  }
  
  async checkDiskSpace() {
    // Implementar verificação de espaço em disco
    return { status: 'healthy', message: 'Espaço disponível' };
  }
  
  checkMemoryUsage() {
    const usage = process.memoryUsage();
    const memoryUsage = {
      rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100
    };
    
    return {
      status: memoryUsage.heapUsed < 100 ? 'healthy' : 'warning',
      message: `${memoryUsage.heapUsed}MB usado de ${memoryUsage.heapTotal}MB`,
      details: memoryUsage
    };
  }
}

module.exports = new DashboardController();
```

## Rotas de Upload (routes/uploads.js)

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Upload de imagem para raspadinha ou prêmio
router.post('/image', upload.single('image'), uploadController.uploadImage);

// Upload de banner
router.post('/banner', upload.single('banner'), uploadController.uploadBanner);

// Upload de logo
router.post('/logo', upload.single('logo'), uploadController.uploadLogo);

// Deletar imagem
router.delete('/image', uploadController.deleteImage);

module.exports = router;
```

## Controlador de Upload (controllers/uploadController.js)

```javascript
const fs = require('fs').promises;
const path = require('path');

class UploadController {
  // Upload de imagem genérica
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: true, 
          message: 'Nenhum arquivo enviado' 
        });
      }
      
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        imageUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro no upload' 
      });
    }
  }
  
  // Upload de banner
  async uploadBanner(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: true, 
          message: 'Nenhum arquivo enviado' 
        });
      }
      
      const bannerNumber = req.body.bannerNumber || '1';
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/banners/${req.file.filename}`;
      
      // Atualizar configurações com nova URL do banner
      await this.updateBannerConfig(bannerNumber, imageUrl);
      
      res.json({
        success: true,
        imageUrl,
        filename: req.file.filename,
        size: req.file.size,
        bannerNumber
      });
    } catch (error) {
      console.error('Erro no upload do banner:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro no upload do banner' 
      });
    }
  }
  
  // Upload de logo
  async uploadLogo(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: true, 
          message: 'Nenhum arquivo enviado' 
        });
      }
      
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/logos/${req.file.filename}`;
      
      // Atualizar configurações com nova URL do logo
      await this.updateLogoConfig(imageUrl);
      
      res.json({
        success: true,
        imageUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error('Erro no upload do logo:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro no upload do logo' 
      });
    }
  }
  
  // Deletar imagem
  async deleteImage(req, res) {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ 
          error: true, 
          message: 'URL da imagem não fornecida' 
        });
      }
      
      // Extrair nome do arquivo da URL
      const filename = path.basename(imageUrl);
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      
      // Verificar se arquivo existe
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({ 
          error: true, 
          message: 'Arquivo não encontrado' 
        });
      }
      
      // Deletar arquivo
      await fs.unlink(filePath);
      
      res.json({
        success: true,
        message: 'Imagem deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Erro ao deletar imagem' 
      });
    }
  }
  
  // Métodos auxiliares
  async updateBannerConfig(bannerNumber, imageUrl) {
    // Implementar atualização das configurações do banner
    console.log(`Banner ${bannerNumber} atualizado para: ${imageUrl}`);
  }
  
  async updateLogoConfig(imageUrl) {
    // Implementar atualização das configurações do logo
    console.log(`Logo atualizado para: ${imageUrl}`);
  }
}

module.exports = new UploadController();
```

## Variáveis de Ambiente (.env)

```env
# Configurações do servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=24h

# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_NAME=raspadinha_db
DB_USER=root
DB_PASS=sua_senha_aqui

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   - Copie o arquivo `.env.example` para `.env`
   - Configure as variáveis necessárias

3. **Criar pastas de upload:**
   ```bash
   mkdir -p uploads/{scratchcards,prizes,banners,logos}
   ```

4. **Executar o servidor:**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

## Testando a API

### Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exemplo.com","password":"admin123"}'
```

### Dashboard Stats
```bash
curl -X GET http://localhost:3000/api/admin/dashboard/stats?period=today \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Upload de Imagem
```bash
curl -X POST http://localhost:3000/api/admin/upload/image \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "image=@caminho/para/imagem.jpg" \
  -F "type=scratchcard"
```

## Próximos Passos

1. **Implementar modelos do banco de dados** usando Sequelize
2. **Adicionar validação de dados** com bibliotecas como Joi ou Yup
3. **Implementar rate limiting** para proteger contra abuso
4. **Adicionar logs estruturados** para monitoramento
5. **Implementar testes automatizados** com Jest ou Mocha
6. **Configurar CORS** adequadamente para produção
7. **Implementar cache** com Redis para melhorar performance
8. **Adicionar documentação da API** com Swagger/OpenAPI
