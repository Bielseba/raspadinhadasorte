# Guia de Instalação Rápida - API Raspadinha da Sorte

## 🚀 Instalação em 3 Passos

### 1. Instalar Dependências
```bash
cd api
npm install
```

### 2. Configurar Ambiente
```bash
# O arquivo .env já está configurado para desenvolvimento
# Para produção, ajuste as variáveis conforme necessário
```

### 3. Executar
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

## ✅ Verificação

Após executar, você deve ver:

```
🚀 Servidor rodando na porta 3000
📱 Ambiente: development
🔗 API disponível em: http://localhost:3000/api
💚 Health check: http://localhost:3000/api/health
```

## 🧪 Testando

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Login Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@raspadinhadasorte.com",
    "password": "admin123"
  }'
```

### Listar Raspadinhas
```bash
curl http://localhost:3000/api/raspadinhas/available
```

## 📁 Estrutura Criada

```
api/
├── src/
│   ├── controllers/      # Controladores (MVC)
│   ├── services/         # Regras de negócio
│   ├── repositories/     # Acesso a dados
│   ├── entities/         # Modelos de domínio
│   ├── interfaces/       # Contratos/Interfaces
│   ├── middlewares/      # Middlewares do Express
│   ├── routes/           # Definição de rotas
│   ├── utils/            # Utilitários e helpers
│   ├── config/           # Configurações da aplicação
│   └── server.ts         # Ponto de entrada
├── examples/             # Exemplos de uso
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração TypeScript
├── .env                  # Variáveis de ambiente
└── README.md             # Documentação completa
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Compilar TypeScript
- `npm start` - Executar produção
- `npm test` - Executar testes
- `npm run lint` - Verificar código
- `npm run lint:fix` - Corrigir problemas

## 🎯 Próximos Passos

1. ✅ API funcionando
2. 🔄 Testar endpoints
3. 🎨 Integrar com frontend
4. 🗄️ Configurar banco de dados (se necessário)
5. 🚀 Deploy

## 📖 Documentação Completa

Veja o arquivo `README.md` para documentação completa da API, incluindo:
- Lista completa de endpoints
- Exemplos de uso
- Estrutura detalhada
- Princípios SOLID aplicados 