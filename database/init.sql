-- Database initialization script
-- Este arquivo será executado quando o container PostgreSQL for criado pela primeira vez
-- O banco de dados já é criado automaticamente pelo PostgreSQL baseado na variável POSTGRES_DB

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('BUYER', 'ORGANIZER', 'ADMIN')),
    avatar TEXT,
    stripe_status VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(50) DEFAULT 'not_started',
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    thumbnail TEXT,
    banner TEXT,
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tipos de ingressos
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    available INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_cpf VARCHAR(20) NOT NULL,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    net_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'failed', 'refund_pending')),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('credit_card', 'pix', 'boleto')),
    refund_reason TEXT,
    refund_requested_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de ingressos do pedido
CREATE TABLE IF NOT EXISTS order_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_event ON orders(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_tickets_order ON order_tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tickets_ticket ON order_tickets(ticket_id);

-- ============================================
-- DADOS INICIAIS / SEED DATA
-- ============================================

-- Usuários de teste para login rápido
-- NOTA: As senhas são hasheadas com bcrypt (10 rounds)
-- Para recriar os usuários com senhas corretas, execute: npm run seed:users
-- Senha padrão para todos: 123456

-- Comprador Feliz (BUYER)
-- Email: buyer@evelou.com | Senha: 123456
-- Hash bcrypt da senha "123456" (10 rounds)
INSERT INTO users (name, email, password_hash, role, avatar, is_verified, kyc_status)
VALUES (
    'Comprador Feliz',
    'buyer@evelou.com',
    '$2a$10$TQTwjvbf4n/bbX86tziBEOoHtcRzuNGSuZLygXGD/sFGL9p0okhKm',
    'BUYER',
    'https://ui-avatars.com/api/?name=Comprador+Feliz&background=random',
    FALSE,
    'not_started'
)
ON CONFLICT (email) DO NOTHING;

-- Organizador Teste (ORGANIZER)
-- Email: organizer@evelou.com | Senha: 123456
-- Hash bcrypt da senha "123456" (10 rounds)
INSERT INTO users (name, email, password_hash, role, avatar, is_verified, kyc_status)
VALUES (
    'Organizador Teste',
    'organizer@evelou.com',
    '$2a$10$TQTwjvbf4n/bbX86tziBEOoHtcRzuNGSuZLygXGD/sFGL9p0okhKm',
    'ORGANIZER',
    'https://ui-avatars.com/api/?name=Organizador+Teste&background=random',
    FALSE,
    'pending'
)
ON CONFLICT (email) DO NOTHING;

-- Admin Evelou (ADMIN)
-- Email: admin@evelou.com | Senha: 123456
-- Hash bcrypt da senha "123456" (10 rounds)
INSERT INTO users (name, email, password_hash, role, avatar, is_verified, kyc_status)
VALUES (
    'Admin Evelou',
    'admin@evelou.com',
    '$2a$10$TQTwjvbf4n/bbX86tziBEOoHtcRzuNGSuZLygXGD/sFGL9p0okhKm',
    'ADMIN',
    'https://ui-avatars.com/api/?name=Admin+Evelou&background=random',
    TRUE,
    'not_started'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================

-- USUÁRIOS DE TESTE
-- Os usuários acima são criados automaticamente com senhas hasheadas.
-- Todos os usuários têm a senha: 123456
--
-- Credenciais dos usuários de teste:
-- - buyer@evelou.com / 123456 (BUYER - Comprador Feliz)
-- - organizer@evelou.com / 123456 (ORGANIZER - Organizador Teste)
-- - admin@evelou.com / 123456 (ADMIN - Admin Evelou)
--
-- NOTA: Se precisar recriar ou atualizar os usuários, execute:
-- npm run seed:users (no diretório backend)
-- O script irá atualizar os dados se os usuários já existirem.
--
-- ESTRUTURA DO BANCO:
-- - users: Usuários do sistema (BUYER, ORGANIZER, ADMIN)
-- - events: Eventos criados pelos organizadores
-- - tickets: Tipos de ingressos para cada evento
-- - orders: Pedidos de ingressos realizados pelos compradores
-- - order_tickets: Relação entre pedidos e ingressos comprados
--
-- RELACIONAMENTOS:
-- - events.organizer_id -> users.id (organizador do evento)
-- - tickets.event_id -> events.id (ingressos do evento)
-- - orders.buyer_id -> users.id (comprador do pedido)
-- - orders.event_id -> events.id (evento do pedido)
-- - order_tickets.order_id -> orders.id (ingressos do pedido)
-- - order_tickets.ticket_id -> tickets.id (tipo de ingresso)

