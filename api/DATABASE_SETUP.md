# Configuração do Banco de Dados PostgreSQL

## Pré-requisitos

1. **PostgreSQL** instalado e rodando
2. **Node.js** e **npm** instalados
3. **TypeScript** configurado

## Passos para Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=raspadinhadasorte

# JWT Secret
JWT_SECRET=seu_jwt_secret_aqui

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Criar Banco de Dados

```sql
CREATE DATABASE raspadinhadasorte;
```

### 4. Executar Migrações

```bash
# Executar migrações para criar as tabelas
npm run migration:run
```

### 5. Verificar Conexão

```bash
# Iniciar o servidor
npm run dev
```

## Estrutura do Banco de Dados

### Tabelas Criadas

1. **users** - Usuários do sistema
2. **raspadinhas** - Cartelas de raspadinha
3. **purchases** - Compras e raspagens

### Enums Criados

1. **user_role_enum** - admin, user
2. **raspadinha_type_enum** - silver, gold, platinum
3. **raspadinha_status_enum** - available, sold, scratched
4. **purchase_status_enum** - pending, completed, cancelled

## Comandos Úteis

```bash
# Gerar nova migração
npm run migration:generate -- src/migrations/NomeDaMigracao

# Executar migrações
npm run migration:run

# Reverter última migração
npm run migration:revert

# Sincronizar schema (desenvolvimento)
npm run schema:sync

# Dropar schema (cuidado!)
npm run schema:drop
```

## Solução de Problemas

### Erro de Conexão
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados existe

### Erro de Permissão
- Certifique-se de que o usuário tem permissões para criar tabelas
- Verifique se a extensão `uuid-ossp` está disponível

### Erro de Migração
- Verifique se o TypeScript está compilando corretamente
- Confirme se o arquivo `ormconfig.ts` está configurado corretamente

## Desenvolvimento

Para desenvolvimento, você pode usar:

```bash
# Sincronizar schema automaticamente (não recomendado para produção)
npm run schema:sync
```

## Produção

Para produção:

1. Desabilite `synchronize: false` no `ormconfig.ts`
2. Use apenas migrações para alterações no schema
3. Configure variáveis de ambiente apropriadas
4. Use um usuário com permissões limitadas 