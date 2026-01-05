# 🚀 Guia de Deploy no VPS

## Clonar o Projeto no Servidor

### 1. Conectar ao VPS

```bash
# Substitua HOSTNAME pelo hostname ou IP do seu servidor
ssh usuario@HOSTNAME

# Ou se você tem um alias configurado no ~/.ssh/config
ssh omayklourenco
```

### 2. Navegar para a Pasta

```bash
cd ~/omayklourenco
# ou
cd /home/omayklourenco/omayklourenco
```

### 3. Clonar o Repositório

```bash
# Clonar o repositório
git clone git@github.com:omayklourenco/Evelou.git

# Ou usando HTTPS (se SSH não estiver configurado)
git clone https://github.com/omayklourenco/Evelou.git

# Entrar no diretório
cd Evelou
```

### 4. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas configurações de produção
nano .env
# ou
vim .env
```

### 5. Configurar para Produção

No arquivo `.env`, ajuste:

```env
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com
VITE_API_URL=https://api.seu-dominio.com
DATABASE_URL=postgresql://user:password@localhost:5432/evelou
JWT_SECRET=uma-chave-secreta-forte-e-longa-aqui
```

### 6. Instalar Docker (se não estiver instalado)

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 7. Iniciar os Serviços

```bash
# Construir e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Verificar status
docker-compose ps
```

### 8. Configurar Nginx (Reverso Proxy - Opcional)

Se quiser usar um domínio personalizado:

```nginx
# /etc/nginx/sites-available/evelou
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3042;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9. Atualizar o Projeto

```bash
cd ~/omayklourenco/Evelou
git pull origin main
docker-compose up -d --build
```

## Comandos Úteis no Servidor

```bash
# Ver logs
docker-compose logs -f

# Reiniciar serviços
docker-compose restart

# Parar serviços
docker-compose down

# Ver status
docker-compose ps

# Executar seed de usuários
docker-compose exec backend npm run seed:users

# Acessar banco de dados
docker-compose exec database psql -U evelou -d evelou
```

## Troubleshooting

### Porta já em uso
```bash
# Verificar qual processo está usando a porta
sudo lsof -i :3040
sudo lsof -i :3041
sudo lsof -i :3042

# Parar o processo ou alterar portas no .env
```

### Erro de permissão Docker
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
# Fazer logout e login novamente
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

