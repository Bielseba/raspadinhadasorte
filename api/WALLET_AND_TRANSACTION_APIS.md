# APIs de Carteira e Transações

Este documento descreve as funcionalidades implementadas para gerenciamento de carteira e transações tanto para usuários quanto para administradores.

## Funcionalidades para Usuários

### Carteira

#### 1. Ver Saldo
- **Endpoint:** `GET /users/:userId/balance`
- **Autenticação:** Obrigatória
- **Descrição:** Retorna o saldo atual da carteira do usuário. Se a carteira não existir, ela será criada automaticamente.
- **Resposta:**
```json
{
  "success": true,
  "data": {
    "balance": 150.50
  },
  "message": "Saldo da carteira recuperado"
}
```

#### 2. Depositar Dinheiro
- **Endpoint:** `POST /users/:userId/deposit`
- **Autenticação:** Obrigatória (apenas na própria carteira)
- **Body:**
```json
{
  "amount": 100.00,
  "description": "Depósito via PIX"
}
```
- **Resposta:**
```json
{
  "success": true,
  "data": {
    "balance": 250.50,
    "amount": 100.00,
    "message": "Depósito de R$ 100.00 realizado com sucesso"
  },
  "message": "Depósito realizado com sucesso"
}
```

#### 3. Sacar Dinheiro
- **Endpoint:** `POST /users/:userId/withdraw`
- **Autenticação:** Obrigatória (apenas da própria carteira)
- **Body:**
```json
{
  "amount": 50.00,
  "description": "Saque para conta bancária"
}
```
- **Resposta:**
```json
{
  "success": true,
  "data": {
    "balance": 200.50,
    "amount": 50.00,
    "message": "Saque de R$ 50.00 realizado com sucesso"
  },
  "message": "Saque realizado com sucesso"
}
```

#### 4. Transferir Dinheiro
- **Endpoint:** `POST /users/:userId/transfer`
- **Autenticação:** Obrigatória (apenas da própria carteira)
- **Body:**
```json
{
  "targetUserId": "uuid-do-usuario-destino",
  "amount": 25.00,
  "description": "Pagamento de serviço"
}
```
- **Resposta:**
```json
{
  "success": true,
  "data": {
    "sourceBalance": 175.50,
    "targetBalance": 75.00,
    "amount": 25.00,
    "message": "Transferência de R$ 25.00 realizada com sucesso"
  },
  "message": "Transferência realizada com sucesso"
}
```

#### 5. Ver Estatísticas Pessoais
- **Endpoint:** `GET /users/:userId/stats`
- **Autenticação:** Obrigatória (apenas próprias estatísticas)
- **Resposta:**
```json
{
  "success": true,
  "data": {
    "currentBalance": 175.50,
    "totalDeposits": 500.00,
    "totalWithdrawals": 324.50,
    "totalTransactions": 15,
    "lastTransaction": {
      "id": "uuid",
      "amount": 25.00,
      "type": "withdrawal",
      "date": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Estatísticas pessoais recuperadas"
}
```

### Transações

#### 1. Ver Últimas Transações
- **Endpoint:** `GET /users/:userId/transactions/recent?limit=10`
- **Autenticação:** Obrigatória
- **Query Parameters:**
  - `limit`: Número de transações (padrão: 10, máximo: 100)

#### 2. Ver Histórico Completo
- **Endpoint:** `GET /users/:userId/transactions`
- **Autenticação:** Obrigatória (apenas próprias transações)
- **Query Parameters:**
  - `page`: Página (padrão: 1)
  - `limit`: Limite por página (padrão: 20, máximo: 100)
  - `type`: Tipo de transação (deposit, withdrawal, transfer, purchase, refund)
  - `startDate`: Data de início (formato ISO)
  - `endDate`: Data de fim (formato ISO)

#### 3. Ver Transação Específica
- **Endpoint:** `GET /users/:userId/transactions/:transactionId`
- **Autenticação:** Obrigatória (apenas própria transação)

#### 4. Exportar Transações
- **Endpoint:** `GET /users/:userId/transactions/export`
- **Autenticação:** Obrigatória (apenas próprias transações)
- **Query Parameters:**
  - `format`: Formato (apenas CSV)
  - `startDate`: Data de início (formato ISO)
  - `endDate`: Data de fim (formato ISO)
- **Resposta:** Arquivo CSV para download

#### 5. Resumo Mensal
- **Endpoint:** `GET /users/:userId/transactions/monthly-summary`
- **Autenticação:** Obrigatória (apenas próprio resumo)
- **Query Parameters:**
  - `year`: Ano (padrão: ano atual)
  - `month`: Mês (padrão: mês atual)

#### 6. Categorias de Transações
- **Endpoint:** `GET /users/:userId/transactions/categories`
- **Autenticação:** Obrigatória (apenas próprias categorias)

## Funcionalidades para Administradores

### Transações do Sistema

#### 1. Ver Todas as Transações
- **Endpoint:** `GET /admin/transactions`
- **Autenticação:** Obrigatória + Role Admin
- **Query Parameters:**
  - `page`: Página (padrão: 1)
  - `limit`: Limite por página (padrão: 20, máximo: 100)
  - `userId`: Filtrar por usuário específico
  - `type`: Filtrar por tipo de transação
  - `startDate`: Data de início (formato ISO)
  - `endDate`: Data de fim (formato ISO)

#### 2. Ver Transações de Usuário Específico
- **Endpoint:** `GET /admin/users/:userId/transactions`
- **Autenticação:** Obrigatória + Role Admin
- **Query Parameters:**
  - `page`: Página (padrão: 1)
  - `limit`: Limite por página (padrão: 20, máximo: 100)

#### 3. Depositar Dinheiro em Usuário
- **Endpoint:** `POST /admin/users/:userId/deposit`
- **Autenticação:** Obrigatória + Role Admin
- **Body:**
```json
{
  "amount": 200.00,
  "description": "Bônus promocional"
}
```

#### 4. Reverter Transação
- **Endpoint:** `POST /admin/transactions/:transactionId/reverse`
- **Autenticação:** Obrigatória + Role Admin
- **Body:**
```json
{
  "reason": "Erro no sistema, valor incorreto"
}
```

### Carteiras

#### 1. Ver Todas as Carteiras
- **Endpoint:** `GET /admin/wallets`
- **Autenticação:** Obrigatória + Role Admin
- **Query Parameters:**
  - `page`: Página (padrão: 1)
  - `limit`: Limite por página (padrão: 20, máximo: 100)

### Estatísticas do Sistema

#### 1. Estatísticas Gerais
- **Endpoint:** `GET /admin/stats/system`
- **Autenticação:** Obrigatória + Role Admin
- **Resposta:**
```json
{
  "success": true,
  "data": {
    "totalTransactions": 1500,
    "totalDeposits": 50000.00,
    "totalWithdrawals": 35000.00,
    "totalAmount": 15000.00,
    "averageTransactionAmount": 10.00,
    "transactionsToday": 25,
    "transactionsThisMonth": 450
  },
  "message": "Estatísticas do sistema recuperadas com sucesso"
}
```

## Segurança e Validações

### Autenticação
- Todas as rotas requerem autenticação via JWT token
- O token deve ser enviado no header: `Authorization: Bearer <token>`

### Autorização
- Usuários só podem acessar suas próprias carteiras e transações
- Administradores têm acesso a todas as funcionalidades do sistema
- Validação de role é feita via middleware

### Validações
- Valores monetários devem ser positivos e ter no máximo 2 casas decimais
- IDs de usuário devem ser UUIDs válidos
- Datas devem estar no formato ISO
- Descrições têm limite de 500 caracteres
- Paginação tem limites mínimos e máximos

### Auditoria
- Todas as transações são registradas com timestamp
- Transações administrativas são marcadas com o ID do admin
- Transações relacionadas (transferências, reversões) são vinculadas
- Saldos anterior e posterior são registrados para auditoria

## Códigos de Erro

- `400`: Dados inválidos ou validação falhou
- `401`: Não autenticado
- `403`: Acesso negado (não autorizado)
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

## Exemplos de Uso

### Frontend - Ver Saldo
```javascript
const response = await fetch('/users/me/balance', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log('Saldo:', data.data.balance);
```

### Frontend - Fazer Depósito
```javascript
const response = await fetch('/users/me/deposit', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 100.00,
    description: 'Depósito via cartão'
  })
});
```

### Admin - Ver Transações do Sistema
```javascript
const response = await fetch('/admin/transactions?page=1&limit=50', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
const data = await response.json();
console.log('Transações:', data.data);
```

## Notas de Implementação

1. **Criação Automática de Carteira**: Se um usuário não tiver carteira, ela será criada automaticamente com saldo zero
2. **Validação de Propriedade**: Usuários só podem acessar suas próprias carteiras e transações
3. **Transações Atômicas**: Todas as operações de carteira são transacionais para garantir consistência
4. **Histórico Completo**: Todas as operações são registradas para auditoria e rastreabilidade
5. **Filtros Avançados**: Sistema de filtros robusto para consultas complexas
6. **Exportação**: Funcionalidade de exportação para relatórios e análises
7. **Estatísticas**: Métricas detalhadas tanto para usuários quanto para o sistema
