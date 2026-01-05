.PHONY: help build up down restart logs clean

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Constrói as imagens Docker
	docker-compose build

up: ## Inicia todos os serviços
	docker-compose up -d

down: ## Para todos os serviços
	docker-compose down

restart: ## Reinicia todos os serviços
	docker-compose restart

logs: ## Mostra os logs de todos os serviços
	docker-compose logs -f

logs-backend: ## Mostra os logs do backend
	docker-compose logs -f backend

logs-frontend: ## Mostra os logs do frontend
	docker-compose logs -f frontend

logs-database: ## Mostra os logs do banco de dados
	docker-compose logs -f database

clean: ## Remove containers, volumes e imagens
	docker-compose down -v --rmi all

setup: ## Configuração inicial do projeto
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Arquivo .env criado. Por favor, edite com suas configurações."; \
	else \
		echo "⚠️  Arquivo .env já existe."; \
	fi

dev: setup build up ## Configura e inicia o ambiente de desenvolvimento
	@echo "✅ Ambiente de desenvolvimento iniciado!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:4000"

