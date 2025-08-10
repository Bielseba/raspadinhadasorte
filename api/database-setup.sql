-- Configuração do Banco de Dados PostgreSQL para Raspadinha da Sorte
-- Execute estes comandos no PostgreSQL para configurar o banco

-- 1. Criar banco de dados
CREATE DATABASE raspadinhadasorte;

-- 2. Conectar ao banco criado
\c raspadinhadasorte;

-- 3. Habilitar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. Verificar se a extensão foi criada
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

-- 5. Verificar versão do PostgreSQL
SELECT version();

-- 6. Listar bancos de dados
\l

-- 7. Listar extensões disponíveis
\dx

-- Comandos úteis para administração:
-- \l - Listar bancos de dados
-- \c nome_do_banco - Conectar a um banco
-- \dt - Listar tabelas
-- \d nome_da_tabela - Descrever estrutura de uma tabela
-- \du - Listar usuários
-- \q - Sair do psql 