# 🚀 Como Iniciar o Projeto

## Pré-requisitos

1. **Docker Desktop** deve estar rodando
   - No macOS: Abra o Docker Desktop
   - Verifique se está rodando: `docker ps`

2. **Arquivo .env** configurado
   ```bash
   cp .env.example .env
   ```

## Iniciar os Serviços

### Opção 1: Usando Docker Compose (Recomendado)

```bash
# Parar serviços anteriores (se houver)
docker-compose down

# Construir e iniciar todos os serviços
docker-compose up --build

# Ou em modo detached (background)
docker-compose up --build -d
```

### Opção 2: Usando Makefile

```bash
# Configurar e iniciar tudo
make dev

# Ou passo a passo
make setup    # Cria arquivo .env
make build    # Constrói imagens
make up        # Inicia serviços
```

## Verificar Status

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Ver status dos containers
docker-compose ps
```

## Acessar os Serviços

Após iniciar, os serviços estarão disponíveis em:

- **Frontend**: http://localhost:3042
- **Backend API**: http://localhost:3041
- **Health Check**: http://localhost:3041/health
- **Database**: localhost:3040

## Parar os Serviços

```bash
# Parar serviços
docker-compose down

# Parar e remover volumes (limpar banco de dados)
docker-compose down -v
```

## Troubleshooting

### Docker não está rodando
```bash
# No macOS, abra o Docker Desktop ou execute:
open -a Docker
```

### Porta já em uso
```bash
# Verificar qual processo está usando a porta
lsof -i :3040
lsof -i :3041
lsof -i :3042

# Parar o processo ou alterar as portas no .env
```

### Erro de conexão com banco
```bash
# Verificar se o banco está rodando
docker-compose ps database

# Ver logs do banco
docker-compose logs database

# Reiniciar apenas o banco
docker-compose restart database
```

### Reconstruir tudo do zero
```bash
# Parar tudo
docker-compose down -v

# Remover imagens
docker-compose rm -f

# Reconstruir
docker-compose up --build
```

## Desenvolvimento Local (sem Docker)

Se preferir rodar localmente:

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
Use o Docker apenas para o banco:
```bash
docker-compose up database
```

