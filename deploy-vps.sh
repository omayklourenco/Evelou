#!/bin/bash

# Script para clonar e configurar o projeto Evelou no VPS
# Execute este script no servidor VPS após conectar via SSH

echo "🚀 Configurando projeto Evelou no VPS..."

# Navegar para a pasta
cd ~/omayklourenco || mkdir -p ~/omayklourenco && cd ~/omayklourenco

# Verificar se já existe
if [ -d "Evelou" ]; then
    echo "⚠️  Diretório Evelou já existe. Fazendo pull..."
    cd Evelou
    git pull origin main
else
    echo "📦 Clonando repositório..."
    # Tentar SSH primeiro, depois HTTPS
    git clone git@github.com:omayklourenco/Evelou.git 2>/dev/null || \
    git clone https://github.com/omayklourenco/Evelou.git
    
    cd Evelou
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Por favor, edite com suas configurações de produção."
else
    echo "✅ Arquivo .env já existe."
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker não está instalado. Instalando..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado. Você precisará fazer logout e login novamente."
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose não está instalado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose instalado."
fi

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Edite o arquivo .env com suas configurações de produção:"
echo "   nano .env"
echo ""
echo "2. Inicie os serviços:"
echo "   docker-compose up -d --build"
echo ""
echo "3. Verifique os logs:"
echo "   docker-compose logs -f"
echo ""
echo "4. Verifique o status:"
echo "   docker-compose ps"
echo ""

