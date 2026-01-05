#!/bin/bash

echo "🚀 Iniciando projeto Evelou..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando!"
    echo "Por favor, inicie o Docker Desktop e tente novamente."
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Você pode editá-lo se necessário."
fi

# Parar containers anteriores
echo "🛑 Parando containers anteriores..."
docker-compose down 2>/dev/null

# Construir e iniciar
echo "🔨 Construindo e iniciando serviços..."
docker-compose up --build -d

# Aguardar alguns segundos
echo "⏳ Aguardando serviços iniciarem..."
sleep 5

# Verificar status
echo ""
echo "📊 Status dos serviços:"
docker-compose ps

echo ""
echo "✅ Serviços iniciados!"
echo ""
echo "🌐 Acesse:"
echo "   Frontend: http://localhost:3042"
echo "   Backend:  http://localhost:3041"
echo "   Health:   http://localhost:3041/health"
echo ""
echo "📋 Para ver os logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para parar os serviços:"
echo "   docker-compose down"

