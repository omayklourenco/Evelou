# Evelou Backend API

API RESTful para o marketplace de eventos Evelou, desenvolvida com Node.js e Express.

## 🚀 Estrutura

```
backend/
├── src/
│   ├── index.js              # Servidor principal
│   ├── routes/               # Rotas da API
│   │   ├── auth.js           # Autenticação
│   │   ├── events.js         # Eventos
│   │   └── orders.js         # Pedidos
│   ├── middleware/           # Middlewares
│   │   ├── auth.js           # Autenticação JWT
│   │   └── errorHandler.js   # Tratamento de erros
│   ├── models/               # Modelos de dados
│   │   ├── userModel.js      # Modelo de usuário
│   │   ├── eventModel.js     # Modelo de evento
│   │   └── orderModel.js     # Modelo de pedido
│   ├── database/             # Configuração do banco
│   │   └── connection.js     # Pool de conexões
│   ├── utils/                # Utilitários
│   │   └── jwt.js            # Funções JWT
│   └── scripts/              # Scripts utilitários
│       └── seedUsers.js      # Seed de usuários
└── package.json
```

## 🔐 Autenticação JWT

A API usa JWT (JSON Web Tokens) para autenticação. Os tokens são gerados no login e devem ser enviados no header `Authorization`:

```
Authorization: Bearer <token>
```

### Rotas Públicas
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/events` - Listar eventos
- `GET /api/events/:id` - Buscar evento
- `GET /api/events/slug/:slug` - Buscar evento por slug

### Rotas Protegidas
Todas as rotas abaixo requerem autenticação (token JWT):

- `GET /api/auth/me` - Obter usuário atual
- `POST /api/auth/logout` - Logout
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Buscar pedido
- `POST /api/orders` - Criar pedido

### Rotas com Autorização por Role
Algumas rotas requerem roles específicas:

- `POST /api/events` - Apenas ORGANIZER ou ADMIN
- `PUT /api/events/:id` - Apenas ORGANIZER ou ADMIN
- `DELETE /api/events/:id` - Apenas ORGANIZER ou ADMIN

## 👥 Usuários de Login Rápido

Para facilitar testes, os seguintes usuários estão cadastrados no banco:

| Email | Senha | Role | Status |
|-------|-------|------|--------|
| buyer@evelou.com | 123456 | BUYER | Não verificado |
| organizer@evelou.com | 123456 | ORGANIZER | KYC pendente |
| admin@evelou.com | 123456 | ADMIN | Verificado |

Para recriar esses usuários:
```bash
npm run seed:users
```

## 📝 Variáveis de Ambiente

```env
NODE_ENV=development
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:3042
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
```

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (com watch)
npm run dev

# Rodar em produção
npm start

# Seed de usuários de teste
npm run seed:users
```

## 📡 Endpoints

### Autenticação

#### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "BUYER" // opcional
}
```

#### POST /api/auth/register
```json
{
  "name": "Nome do Usuário",
  "email": "user@example.com",
  "password": "password123",
  "role": "BUYER" // opcional, padrão: BUYER
}
```

#### GET /api/auth/me
Requer autenticação. Retorna dados do usuário atual.

### Eventos

#### GET /api/events
Lista eventos com filtros opcionais:
- `category` - Filtrar por categoria
- `search` - Buscar por nome/organizador/localização
- `page` - Número da página
- `limit` - Itens por página

#### GET /api/events/:id
Busca evento por ID.

#### GET /api/events/slug/:slug
Busca evento por slug.

#### POST /api/events
Cria novo evento (requer autenticação de ORGANIZER ou ADMIN).

#### PUT /api/events/:id
Atualiza evento (requer autenticação de ORGANIZER ou ADMIN).

#### DELETE /api/events/:id
Deleta evento (requer autenticação de ORGANIZER ou ADMIN).

### Pedidos

#### GET /api/orders
Lista pedidos do usuário autenticado.

#### GET /api/orders/:id
Busca pedido por ID.

#### POST /api/orders
Cria novo pedido.

## 🔒 Segurança

- Tokens JWT com expiração configurável
- Validação de dados com Zod
- Middleware de autenticação e autorização
- CORS configurado
- Tratamento de erros padronizado
- Hash de senhas com bcrypt (10 rounds)

## 📦 Próximos Passos

- [x] Integração completa com banco de dados PostgreSQL
- [x] Hash de senhas com bcrypt
- [x] Seed de usuários de teste
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Upload de imagens
- [ ] Paginação completa
- [ ] Filtros avançados
- [ ] Cache com Redis
- [ ] Logs estruturados
