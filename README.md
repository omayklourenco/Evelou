# 🎫 Evelou - Marketplace de Eventos

Sistema completo de marketplace de eventos com frontend, backend, banco de dados e aplicativo mobile.

## 📁 Estrutura do Projeto

```
evelou/
├── frontend/          # Aplicação React (Vite)
├── backend/           # API Node.js/Express
├── database/          # Scripts e configurações do PostgreSQL
├── mobile/            # Aplicativo React Native
├── docker-compose.yml # Orquestração dos serviços
└── .env.example       # Exemplo de variáveis de ambiente
```

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

### 1. Configuração Inicial

```bash
# Clonar o repositório
git clone git@github.com:omayklourenco/Evelou.git
cd Evelou

# Copiar arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Editar .env e ajustar as configurações conforme necessário
```

### 2. Executar com Docker

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Ou em modo detached (background)
docker-compose up -d --build

# Ou usar o script de inicialização
./start.sh
```

Os serviços estarão disponíveis em:
- **Frontend**: http://localhost:3042
- **Backend API**: http://localhost:3041
- **Database**: localhost:3040

### 3. Parar os serviços

```bash
docker-compose down

# Para remover volumes também (limpar banco de dados)
docker-compose down -v
```

## 🛠️ Desenvolvimento Local

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em http://localhost:3000 (ou porta configurada no vite.config.ts)

### Backend

```bash
cd backend
npm install
npm run dev
```

O backend estará disponível em http://localhost:4000 (porta interna) ou http://localhost:3041 (via Docker)

### Banco de Dados

O banco de dados PostgreSQL roda via Docker. Para conectar:

```bash
# Via docker exec
docker exec -it evelou-database psql -U evelou -d evelou
```

## 👥 Usuários de Teste

Os seguintes usuários estão pré-cadastrados no banco de dados:

| Email | Senha | Role | Status |
|-------|-------|------|--------|
| buyer@evelou.com | 123456 | BUYER | Não verificado |
| organizer@evelou.com | 123456 | ORGANIZER | KYC pendente |
| admin@evelou.com | 123456 | ADMIN | Verificado |

Para recriar os usuários:
```bash
docker-compose exec backend npm run seed:users
```

## 📝 Variáveis de Ambiente

Principais variáveis que podem ser configuradas no arquivo `.env`:

- `NODE_ENV`: Ambiente (development/production)
- `POSTGRES_DB`: Nome do banco de dados
- `POSTGRES_USER`: Usuário do PostgreSQL
- `POSTGRES_PASSWORD`: Senha do PostgreSQL
- `POSTGRES_PORT`: Porta externa do banco (padrão: 3040)
- `BACKEND_PORT`: Porta externa do backend (padrão: 3041)
- `FRONTEND_PORT`: Porta externa do frontend (padrão: 3042)
- `VITE_API_URL`: URL da API para o frontend (padrão: http://localhost:3041)
- `JWT_SECRET`: Chave secreta para JWT
- `GEMINI_API_KEY`: Chave da API do Google Gemini

## 🔧 URLs e Rotas

O projeto foi configurado para usar **BrowserRouter** ao invés de HashRouter, permitindo URLs limpas:

- `/` - Home
- `/eventos` - Explorar eventos
- `/evento/:slug` - Detalhes do evento
- `/login` - Login
- `/cadastro` - Cadastro
- `/meus-ingressos` - Meus ingressos (Comprador)
- `/organizador/*` - Painel do organizador
- `/admin/*` - Painel administrativo

## 📱 Mobile App

O aplicativo mobile está na pasta `mobile/`. Para desenvolvimento:

```bash
cd mobile
npm install
npm run android  # ou npm run ios
```

## 🐳 Docker

### Comandos Úteis

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Reconstruir um serviço específico
docker-compose up --build backend

# Executar comandos dentro de um container
docker-compose exec backend npm run migrate
```

## 📚 Estrutura de Pastas Detalhada

### Frontend (`/frontend`)
- `src/` - Código fonte
- `src/pages/` - Páginas da aplicação
- `src/components/` - Componentes reutilizáveis
- `src/stores/` - Estado global (Zustand)
- `src/config/` - Configurações (API, etc)
- `src/services/` - Serviços de API

### Backend (`/backend`)
- `src/` - Código fonte
- `src/routes/` - Rotas da API
- `src/models/` - Modelos de dados
- `src/middleware/` - Middlewares (auth, error handling)
- `src/database/` - Configuração do banco
- `src/utils/` - Utilitários (JWT, etc)
- `src/scripts/` - Scripts utilitários (seed, etc)

### Database (`/database`)
- `init.sql` - Script de inicialização do banco (com usuários de teste)
- `Dockerfile` - Imagem do PostgreSQL

## 🔐 Segurança

⚠️ **IMPORTANTE**: Antes de fazer deploy em produção:

1. Altere todas as senhas padrão no `.env`
2. Configure um `JWT_SECRET` forte
3. Configure HTTPS
4. Revise as configurações de CORS
5. Configure variáveis de ambiente seguras

## 📄 Licença

Este projeto é privado.

## 🤝 Contribuindo

Para contribuir com o projeto, siga o padrão de código existente e crie branches para novas features.

## 🌿 Branches

- `main` - Branch principal com a estrutura completa do projeto
- `google-ai` - Branch com o código original do Google AI Studio
