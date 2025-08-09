# Guia de Solução de Problemas

## ❌ Erro: "Cannot find module '@config/express'"

### Causa
O TypeScript não consegue resolver os path mappings (@config, @services, etc.) durante a execução.

### Soluções

#### Opção 1: Usar ts-node-dev (Recomendado para desenvolvimento)
```bash
# 1. Instalar ts-node-dev
npm install ts-node-dev --save-dev

# 2. Executar com ts-node-dev
npm run dev
```

#### Opção 2: Compilar e executar
```bash
# 1. Compilar TypeScript
npm run build

# 2. Executar versão compilada
npm start
```

#### Opção 3: Usar servidor simples para teste
```bash
# Executar servidor básico para teste
npx ts-node src/simple-server.ts
```

#### Opção 4: Ajustar importações para caminhos relativos
Se o problema persistir, substitua todas as importações de @ por caminhos relativos:

```typescript
// Em vez de:
import { Container } from '@config/container';

// Use:
import { Container } from '../config/container';
```

## 🔧 Verificação de Instalação

1. **Verificar Node.js**:
```bash
node --version  # Deve ser 18+
npm --version
```

2. **Instalar dependências**:
```bash
cd api
npm install
```

3. **Testar compilação**:
```bash
npm run build
```

4. **Executar testes**:
```bash
npm test
```

## 🚀 Execução Rápida

### Para desenvolvimento:
```bash
cd api
npm install
npm run dev
```

### Para teste básico:
```bash
cd api
npm install
npx ts-node src/simple-server.ts
```

## 📝 Verificações

- ✅ Node.js 18+ instalado
- ✅ Dependências instaladas (`npm install`)
- ✅ Arquivo `.env` configurado
- ✅ TypeScript configurado corretamente
- ✅ Path mappings no `tsconfig.json`

## 🆘 Se nada funcionar

Execute o servidor de teste simples:
```bash
npx ts-node src/simple-server.ts
```

Isso deve funcionar e mostrar que a estrutura básica está correta. Depois, ajuste gradualmente as importações complexas. 