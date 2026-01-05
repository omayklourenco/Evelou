# 📋 Comandos para Executar no VPS

## 1. Conectar ao VPS

```bash
ssh vps_oslou_hostinger
# ou
ssh root@72.60.151.209
```

## 2. Navegar para a Pasta

```bash
cd ~/omayklourenco
# ou criar se não existir
mkdir -p ~/omayklourenco && cd ~/omayklourenco
```

## 3. Clonar o Repositório

### Opção A: Usando SSH (recomendado se tiver chave configurada)

```bash
git clone git@github.com:omayklourenco/Evelou.git
```

### Opção B: Usando HTTPS

```bash
git clone https://github.com/omayklourenco/Evelou.git
```

## 4. Entrar no Diretório

```bash
cd Evelou
```

## 5. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas configurações
nano .env
# ou
vim .env
```

### Configurações Importantes para Produção:

```env
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com
VITE_API_URL=https://api.seu-dominio.com
DATABASE_URL=postgresql://evelou:senha-forte@database:5432/evelou
JWT_SECRET=uma-chave-secreta-muito-forte-e-longa-aqui-minimo-32-caracteres
```

## 6. Instalar Docker (se necessário)

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Fazer logout e login novamente para aplicar mudanças do grupo docker
```

## 7. Iniciar os Serviços

```bash
# Construir e iniciar em background
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f

# Ver status dos containers
docker-compose ps
```

## 8. Verificar se Está Funcionando

```bash
# Health check do backend
curl http://localhost:3041/health

# Verificar frontend
curl http://localhost:3042
```

## 9. Comandos Úteis

```bash
# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Reiniciar um serviço
docker-compose restart backend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpar banco)
docker-compose down -v

# Executar seed de usuários
docker-compose exec backend npm run seed:users

# Acessar banco de dados
docker-compose exec database psql -U evelou -d evelou
```

## 10. Atualizar o Projeto

```bash
cd ~/omayklourenco/Evelou
git pull origin main
docker-compose up -d --build
```

## 11. Configurar Nginx (Opcional - para domínio personalizado)

```bash
sudo nano /etc/nginx/sites-available/evelou
```

Conteúdo do arquivo:

```nginx
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

Ativar o site:

```bash
sudo ln -s /etc/nginx/sites-available/evelou /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting

### Porta já em uso
```bash
sudo lsof -i :3040
sudo lsof -i :3041
sudo lsof -i :3042
```

### Erro de permissão Docker
```bash
sudo usermod -aG docker $USER
# Fazer logout e login
```

### Verificar se containers estão rodando
```bash
docker ps
docker-compose ps
```

### Reiniciar tudo
```bash
docker-compose down
docker-compose up -d --build
```

