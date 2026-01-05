FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo dev para desenvolvimento)
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 4000

# Comando para iniciar (usa dev em desenvolvimento, start em produção)
CMD ["npm", "run", "dev"]

