FROM postgres:16-alpine

# Copiar script de inicialização
COPY init.sql /docker-entrypoint-initdb.d/

# Variáveis de ambiente serão passadas via docker-compose
ENV POSTGRES_DB=evelou
ENV POSTGRES_USER=evelou
ENV POSTGRES_PASSWORD=evelou123

EXPOSE 5432

