# Painel de Administração - Plataforma Premiada

## Visão Geral

Este é um painel de administração completo para a plataforma de raspadinhas online. Ele permite gerenciar usuários, raspadinhas, transações, envios e configurações do site, incluindo um sistema robusto de upload de imagens.

## Funcionalidades Principais

### 🔐 Autenticação
- Login seguro com credenciais de administrador
- Sistema de tokens JWT para sessões
- Logout automático

### 📊 Dashboard
- Estatísticas em tempo real
- Gráficos de receita e popularidade
- Visão geral do sistema

### 👥 Gerenciamento de Usuários
- Listar todos os usuários
- Editar saldos (adicionar/remover)
- Bloquear/desbloquear usuários
- Ver histórico de transações

### 🎫 Gerenciamento de Raspadinhas
- Criar novas raspadinhas
- Editar raspadinhas existentes
- Upload de imagens personalizadas
- Configurar preços e prêmios
- Gerenciar cores de fundo

### 💰 Transações
- Visualizar todas as transações
- Filtrar por tipo e status
- Histórico completo de movimentações

### 🚚 Gerenciamento de Envios
- Acompanhar status de envios
- Atualizar códigos de rastreamento
- Gerenciar ciclo de vida dos pedidos

### ⚙️ Configurações do Site
- Upload de logo personalizado
- Configurar cor principal
- Gerenciar banners do carrossel
- Upload de imagens para banners

### 🖼️ Sistema de Upload de Imagens
- Suporte a múltiplos formatos (JPG, PNG, GIF, WebP)
- Validação de tamanho (máximo 5MB)
- Preview em tempo real
- Barra de progresso
- Organização automática por tipo

## Estrutura de Arquivos

```
public/admin/
├── index.html          # Interface principal
├── app.js             # Módulo principal com todas as funções
├── main.js            # Gerenciador da interface
├── imageManager.js    # Gerenciador de uploads de imagem
├── services/          # Serviços de API
│   ├── authService.js
│   ├── userService.js
│   ├── scratchcardService.js
│   ├── transactionService.js
│   ├── shippingService.js
│   ├── settingsService.js
│   └── imageService.js
├── utils/             # Utilitários
│   └── api.js        # Configuração da API
├── API_ROUTES.md      # Documentação das rotas da API
└── README.md          # Este arquivo
```

## Como Usar

### 1. Acesso ao Sistema
- Abra `public/admin/index.html` no navegador
- Use as credenciais padrão:
  - **Usuário**: `admin`
  - **Senha**: `admin123`

### 2. Navegação
- **Dashboard**: Visão geral e estatísticas
- **Usuários**: Gerenciar usuários e saldos
- **Raspadinhas**: Criar e editar raspadinhas
- **Transações**: Visualizar histórico financeiro
- **Envios**: Acompanhar status de pedidos
- **Configurações**: Personalizar aparência do site

### 3. Upload de Imagens

#### Para Raspadinhas:
1. Clique em "Criar Nova Raspadinha" ou "Editar"
2. No campo de imagem, clique em "Escolher Arquivo"
3. Selecione uma imagem (máximo 5MB)
4. A imagem será enviada automaticamente
5. A URL será preenchida automaticamente

#### Para Banners:
1. Vá para "Configurações"
2. Na seção de banners, clique em "Escolher Arquivo"
3. Selecione a imagem desejada
4. A imagem será enviada e a URL atualizada

#### Para Logo:
1. Vá para "Configurações"
2. Na seção "Identidade Visual", clique em "Escolher Arquivo"
3. Selecione o novo logo
4. A imagem será enviada e aplicada

### 4. Gerenciamento de Usuários
1. Vá para "Usuários"
2. Clique no ícone de edição (lápis) na linha do usuário
3. Digite o valor para adicionar ou remover
4. Clique em "Adicionar Saldo" ou "Remover Saldo"

### 5. Criação de Raspadinhas
1. Clique em "Criar Nova Raspadinha"
2. Preencha:
   - Nome da raspadinha
   - Preço
   - Informação do prêmio
   - Cor de fundo (opcional)
   - Imagem personalizada (opcional)
3. Clique em "Salvar"

## Configuração da API

### Variáveis de Ambiente
```bash
# URL da API (padrão: http://localhost:3000)
VITE_API_BASE_URL=http://localhost:3000
```

### Estrutura de Pastas para Uploads
```
uploads/
├── scratchcards/     # Imagens de raspadinhas
├── prizes/          # Imagens de prêmios
├── banners/         # Banners do carrossel
└── logos/           # Logo do site
```

## Requisitos Técnicos

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Módulos ES6 para organização
- Chart.js para gráficos
- Font Awesome para ícones

### Backend (necessário implementar)
- Node.js com Express
- Autenticação JWT
- Multer para upload de arquivos
- Banco de dados (MySQL, PostgreSQL, etc.)
- Sistema de arquivos para uploads

### Navegadores Suportados
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Segurança

### Autenticação
- Tokens JWT com expiração
- Validação de sessão
- Logout automático

### Upload de Arquivos
- Validação de tipo MIME
- Limite de tamanho (5MB)
- Sanitização de nomes de arquivo
- Organização por tipo

### API
- Middleware de autenticação
- Validação de entrada
- Tratamento de erros
- Rate limiting (recomendado)

## Personalização

### Cores
As cores principais podem ser alteradas no arquivo CSS:
```css
:root {
    --primary-gold: #f5b942;        /* Cor principal */
    --primary-gold-hover: #ffc95e;  /* Cor hover */
    --bg-dark: #121212;             /* Fundo escuro */
    --bg-card: #2a2a2a;             /* Fundo dos cards */
}
```

### Layout
- Responsivo para mobile e desktop
- Sidebar colapsável em telas pequenas
- Grid adaptativo para diferentes tamanhos

## Troubleshooting

### Problemas Comuns

#### Upload não funciona
- Verifique se a API está rodando
- Confirme se a pasta de uploads existe
- Verifique permissões de escrita

#### Login não funciona
- Confirme se as credenciais estão corretas
- Verifique se a API de autenticação está funcionando
- Limpe o localStorage do navegador

#### Imagens não aparecem
- Verifique se as URLs estão corretas
- Confirme se as imagens foram enviadas
- Verifique permissões de acesso aos arquivos

### Logs
- Abra o console do navegador (F12)
- Verifique mensagens de erro
- Confirme se as requisições estão sendo feitas

## Desenvolvimento

### Adicionando Novas Funcionalidades
1. Crie o serviço em `services/`
2. Adicione as funções em `app.js`
3. Implemente a interface em `main.js`
4. Adicione as rotas da API

### Modificando Estilos
- Edite o CSS inline no `index.html`
- Ou crie um arquivo CSS separado
- Use as variáveis CSS para consistência

### Extendendo a API
- Siga o padrão estabelecido em `API_ROUTES.md`
- Implemente autenticação em todas as rotas
- Use o middleware de upload para imagens

## Suporte

Para suporte técnico ou dúvidas:
1. Verifique este README
2. Consulte a documentação da API
3. Verifique os logs do console
4. Teste em diferentes navegadores

## Licença

Este projeto é parte da Plataforma Premiada e está sujeito aos termos de licença do projeto principal.
