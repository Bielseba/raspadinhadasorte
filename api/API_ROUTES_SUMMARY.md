# 🚀 API Raspadinha da Sorte - Rotas Implementadas com PostgreSQL

## 📋 Resumo da Implementação

A API foi completamente migrada para usar **PostgreSQL** com **TypeORM**, implementando todas as rotas necessárias para o sistema de raspadinhas da sorte.

## 🗄️ Banco de Dados

- **Sistema**: PostgreSQL
- **ORM**: TypeORM
- **Migrações**: Suportadas
- **Seeds**: Dados iniciais automáticos

## 🔗 Rotas da API

### **🏥 Health Check**
- `GET /api/health` - Status da API

### **🔐 Autenticação (`/api/auth`)**
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário  
- `POST /api/auth/validate-token` - Validação de token

### **🎯 Raspadinhas (`/api/raspadinhas`)**
**Rotas Públicas:**
- `GET /api/raspadinhas` - Listar todas as raspadinhas
- `GET /api/raspadinhas/available` - Listar raspadinhas disponíveis
- `GET /api/raspadinhas/:id` - Obter raspadinha específica

**Rotas Administrativas (Admin):**
- `POST /api/raspadinhas` - Criar nova raspadinha
- `PUT /api/raspadinhas/:id` - Atualizar raspadinha
- `DELETE /api/raspadinhas/:id` - Deletar raspadinha

### **👤 Usuários (`/api/users`)**
**Rotas para Usuário Autenticado:**
- `GET /api/users/profile` - Perfil do usuário logado
- `PUT /api/users/change-password` - Alterar senha

**Rotas Administrativas (Admin):**
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Obter usuário específico
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### **💰 Compras (`/api/purchases`)**
**Rotas para Usuário Autenticado:**
- `POST /api/purchases/purchase` - Comprar raspadinha
- `POST /api/purchases/:id/scratch` - Raspar cartela
- `GET /api/purchases/my-purchases` - Minhas compras

**Rotas Administrativas (Admin):**
- `GET /api/purchases` - Listar todas as compras
- `GET /api/purchases/:id` - Obter compra específica
- `PUT /api/purchases/:id` - Atualizar compra
- `DELETE /api/purchases/:id` - Deletar compra

## 🏗️ Arquitetura Implementada

### **Entidades (TypeORM)**
- ✅ `User` - Usuários do sistema
- ✅ `Raspadinha` - Cartelas de raspadinha
- ✅ `Purchase` - Compras e raspagens

### **Repositórios**
- ✅ `UserRepository` - Operações CRUD de usuários
- ✅ `RaspadinhaRepository` - Operações CRUD de raspadinhas
- ✅ `PurchaseRepository` - Operações CRUD de compras

### **Serviços**
- ✅ `AuthService` - Autenticação e autorização
- ✅ `UserService` - Lógica de negócio de usuários
- ✅ `RaspadinhaService` - Lógica de negócio de raspadinhas
- ✅ `PurchaseService` - Lógica de negócio de compras

### **Controladores**
- ✅ `AuthController` - Endpoints de autenticação
- ✅ `UserController` - Endpoints de usuários
- ✅ `RaspadinhaController` - Endpoints de raspadinhas
- ✅ `PurchaseController` - Endpoints de compras

### **Middlewares**
- ✅ `AuthMiddleware` - Autenticação JWT
- ✅ `ValidationMiddleware` - Validação de dados
- ✅ `ErrorMiddleware` - Tratamento de erros

## 🚀 Como Executar

### **1. Instalar Dependências**
```bash
npm install
```

### **2. Configurar Banco de Dados**
```bash
# Criar arquivo .env com suas configurações
cp .env.example .env
# Editar .env com suas credenciais do PostgreSQL
```

### **3. Criar Banco de Dados**
```sql
CREATE DATABASE raspadinhadasorte;
```

### **4. Executar Migrações**
```bash
npm run migration:run
```

### **5. Executar Seed (Dados Iniciais)**
```bash
npm run seed
```

### **6. Iniciar Servidor**
```bash
npm run dev
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Executar testes
npm test

# Linting
npm run lint
npm run lint:fix

# Migrações
npm run migration:run
npm run migration:revert

# Seed de dados
npm run seed
```

## 📊 Estrutura do Banco

### **Tabelas**
- `users` - Usuários (admin/user)
- `raspadinhas` - Cartelas de raspadinha
- `purchases` - Compras e raspagens

### **Enums**
- `user_role_enum` - admin, user
- `raspadinha_type_enum` - silver, gold, platinum
- `raspadinha_status_enum` - available, sold, scratched
- `purchase_status_enum` - pending, completed, cancelled

### **Relacionamentos**
- `User` ↔ `Purchase` (1:N)
- `Raspadinha` ↔ `Purchase` (1:N)

## 🔐 Segurança

- ✅ **JWT** para autenticação
- ✅ **bcrypt** para hash de senhas
- ✅ **Validação** de dados com Joi
- ✅ **Rate Limiting** para proteção contra ataques
- ✅ **Helmet** para headers de segurança
- ✅ **CORS** configurado
- ✅ **Autorização** baseada em roles

## 🌟 Funcionalidades

- ✅ **Sistema de Usuários** completo
- ✅ **Autenticação JWT** segura
- ✅ **CRUD** de raspadinhas
- ✅ **Sistema de Compras** integrado
- ✅ **Raspagem** de cartelas
- ✅ **Controle de Prêmios**
- ✅ **Dashboard Admin** completo
- ✅ **Validações** robustas
- ✅ **Tratamento de Erros** centralizado

## 📝 Notas de Desenvolvimento

- **TypeORM** com decoradores para entidades
- **PostgreSQL** com suporte a UUIDs
- **Migrações** para controle de schema
- **Seeds** para dados iniciais
- **Container** para injeção de dependências
- **SOLID** principles aplicados
- **TypeScript** com configuração estrita

## 🎯 Próximos Passos

1. **Testes Unitários** - Implementar com Jest
2. **Testes de Integração** - Testar endpoints
3. **Documentação Swagger** - API docs
4. **Logs** - Sistema de logging
5. **Monitoramento** - Métricas e health checks
6. **Cache** - Redis para performance
7. **Queue** - Processamento assíncrono

---

**✅ API completamente funcional com PostgreSQL!** 