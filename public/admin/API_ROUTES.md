# Rotas da API para o Painel de Administração

## Autenticação
- `POST /api/admin/login` - Login do administrador
- `POST /api/admin/logout` - Logout do administrador
- `GET /api/admin/validate-token` - Validar token JWT

## Dashboard
- `GET /api/admin/dashboard/stats?period=today` - Estatísticas do dashboard
- `GET /api/admin/dashboard/revenue?period=month` - Dados do gráfico de receita
- `GET /api/admin/dashboard/popularity` - Dados do gráfico de popularidade
- `GET /api/admin/dashboard/recent-activity?limit=10` - Atividades recentes
- `GET /api/admin/dashboard/system-health` - Saúde do sistema

## Usuários
- `GET /api/admin/users` - Listar todos os usuários
- `GET /api/admin/users/:id` - Obter usuário específico
- `PUT /api/admin/users/:id/balance` - Atualizar saldo do usuário
- `PUT /api/admin/users/:id/block` - Bloquear/desbloquear usuário
- `GET /api/admin/users/:id/transactions` - Histórico de transações do usuário

## Raspadinhas
- `GET /api/admin/scratchcards` - Listar todas as raspadinhas
- `POST /api/admin/scratchcards` - Criar nova raspadinha
- `GET /api/admin/scratchcards/:id` - Obter raspadinha específica
- `PUT /api/admin/scratchcards/:id` - Atualizar raspadinha
- `DELETE /api/admin/scratchcards/:id` - Deletar raspadinha
- `GET /api/admin/scratchcards/:id/prizes` - Listar prêmios de uma raspadinha
- `POST /api/admin/scratchcards/:id/prizes` - Adicionar prêmio a uma raspadinha
- `PUT /api/admin/scratchcard-prizes/:id` - Atualizar prêmio
- `DELETE /api/admin/scratchcard-prizes/:id` - Deletar prêmio

## Transações
- `GET /api/admin/transactions` - Listar todas as transações (com filtros opcionais)
- `GET /api/admin/transactions/:id` - Obter transação específica
- `PUT /api/admin/transactions/:id/status` - Atualizar status da transação
- `GET /api/admin/transactions/stats?period=today` - Estatísticas das transações

## Envios
- `GET /api/admin/shippings` - Listar todos os envios (com filtros opcionais)
- `GET /api/admin/shippings/:id` - Obter envio específico
- `POST /api/admin/shippings` - Criar novo envio
- `PUT /api/admin/shippings/:id` - Atualizar status do envio
- `DELETE /api/admin/shippings/:id` - Deletar envio

## Configurações
- `GET /api/admin/settings` - Obter configurações do site
- `PUT /api/admin/settings` - Atualizar configurações do site

## Upload de Imagens
- `POST /api/admin/upload-image` - Upload de imagem para raspadinha ou prêmio
- `POST /api/admin/upload-banner` - Upload de banner do carrossel
- `POST /api/admin/upload-logo` - Upload do logo do site
- `DELETE /api/admin/delete-image` - Deletar imagem

## Estrutura de Dados

### Dashboard Stats
```json
{
  "revenue": 1250.70,
  "newUsers": 42,
  "scratchcardsSold": 856,
  "totalUsers": 1430,
  "period": "today"
}
```

### Revenue Chart Data
```json
{
  "labels": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  "datasets": [{
    "label": "Receita Mensal",
    "data": [1200, 1900, 3000, 5000, 2000, 3000],
    "borderColor": "#f5b942",
    "backgroundColor": "rgba(245, 185, 66, 0.1)"
  }]
}
```

### Popularity Chart Data
```json
{
  "labels": ["PIX na conta", "Me mimei", "Sonho de Consumo"],
  "datasets": [{
    "data": [45, 30, 25],
    "backgroundColor": ["#4a90e2", "#c84a8a", "#555"]
  }]
}
```

### Recent Activity
```json
[
  {
    "id": "1",
    "type": "user_registration",
    "description": "Novo usuário cadastrado",
    "timestamp": "2025-08-08T10:30:00Z",
    "details": {
      "userId": "101",
      "userName": "Carlos F."
    }
  }
]
```

### Raspadinha
```json
{
  "id": "string",
  "name": "string",
  "price": "number",
  "prize": "string",
  "color": "string (hex)",
  "image": "string (url)",
  "active": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Prêmio
```json
{
  "id": "string",
  "scratchcardId": "string",
  "name": "string",
  "description": "string",
  "image": "string (url)",
  "probability": "number (0-1)",
  "active": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Usuário
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "balance": "number",
  "status": "string (active/blocked)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Transação
```json
{
  "id": "string",
  "userId": "string",
  "type": "string (deposit/withdrawal/prize)",
  "amount": "number",
  "status": "string (pending/completed/failed)",
  "createdAt": "date"
}
```

### Envio
```json
{
  "id": "string",
  "userId": "string",
  "prize": "string",
  "status": "string (received/preparing/shipped/delivered)",
  "tracking": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Configurações
```json
{
  "logo": "string (url)",
  "primaryColor": "string (hex)",
  "banners": ["string (url)"],
  "siteName": "string",
  "maintenanceMode": "boolean"
}
```

## Autenticação

Todas as rotas (exceto login) requerem um token JWT no header:
```
Authorization: Bearer <token>
```

## Respostas de Erro

```json
{
  "error": true,
  "message": "Descrição do erro",
  "code": "ERROR_CODE"
}
```

## Respostas de Sucesso

```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

## Upload de Imagens

### Endpoint: `POST /api/admin/upload-image`
- **Content-Type**: `multipart/form-data`
- **Parâmetros**:
  - `image`: arquivo de imagem
  - `type`: tipo da imagem (`scratchcard` ou `prize`)

### Endpoint: `POST /api/admin/upload-banner`
- **Content-Type**: `multipart/form-data`
- **Parâmetros**:
  - `banner`: arquivo de imagem
  - `bannerNumber`: número do banner (1, 2 ou 3)

### Endpoint: `POST /api/admin/upload-logo`
- **Content-Type**: `multipart/form-data`
- **Parâmetros**:
  - `logo`: arquivo de imagem

### Resposta de Upload
```json
{
  "success": true,
  "imageUrl": "https://exemplo.com/uploads/imagem.jpg",
  "filename": "imagem.jpg",
  "size": 12345
}
```

## Filtros e Parâmetros

### Transações
- `type`: tipo da transação (deposit, withdrawal, prize)
- `status`: status da transação (pending, completed, failed)
- `startDate`: data de início (ISO 8601)
- `endDate`: data de fim (ISO 8601)
- `userId`: ID do usuário

### Envios
- `status`: status do envio
- `userId`: ID do usuário
- `startDate`: data de início (ISO 8601)
- `endDate`: data de fim (ISO 8601)

### Dashboard
- `period`: período das estatísticas (today, week, month, year)

## Implementação no Backend

### 1. Criar pasta para uploads
```
uploads/
├── scratchcards/
├── prizes/
├── banners/
└── logos/
```

### 2. Middleware de autenticação
```typescript
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: true, message: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: true, message: 'Token inválido' });
  }
};
```

### 3. Middleware de upload
```typescript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (req.path.includes('banner')) {
      uploadPath += 'banners/';
    } else if (req.path.includes('logo')) {
      uploadPath += 'logos/';
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

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

export { upload };
```

### 4. Exemplo de rota de upload
```typescript
import express from 'express';
import { upload } from '../middlewares/upload';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: 'Nenhum arquivo enviado' });
    }
    
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Erro no upload' });
  }
});

export default router;
```

### 5. Exemplo de rota do dashboard
```typescript
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const period = req.query.period || 'today';
    
    // Buscar estatísticas do banco de dados
    const stats = await getDashboardStats(period);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Erro ao buscar estatísticas' });
  }
});
```
