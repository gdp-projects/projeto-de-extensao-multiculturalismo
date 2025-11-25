-- ===========================
-- TABELA: usuarios
-- ===========================
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  primeiro_nome VARCHAR(150) NOT NULL,
  sobrenome VARCHAR(150),
  email VARCHAR(255) NOT NULL UNIQUE,
  nome_usuario VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  data_nascimento DATE,
  telefone VARCHAR(50),
  foto TEXT,
  isVerify BOOLEAN NOT NULL DEFAULT FALSE,
  isPro BOOLEAN NOT NULL DEFAULT FALSE,
  isOrganizer BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===========================
-- TABELA: eventos
-- ===========================
CREATE TABLE IF NOT EXISTS eventos (
  id SERIAL PRIMARY KEY,
  nome_evento VARCHAR(255) NOT NULL,
  foto_local TEXT,
  descricao TEXT,
  data_inicio DATE,
  hora_inicio TIME,
  data_fim DATE,
  hora_fim TIME,
  endereco TEXT,
  categoria TEXT[],
  status VARCHAR(50) NOT NULL DEFAULT 'ativo',
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===========================
-- TABELA: ingressos
-- ===========================
CREATE TABLE IF NOT EXISTS ingressos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  preco NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  quantidade INTEGER NOT NULL DEFAULT 0,
  fk_evento INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===========================
-- TABELA ASSOCIATIVA: organizador_evento
-- ===========================
CREATE TABLE IF NOT EXISTS organizador_evento (
  id SERIAL PRIMARY KEY,
  id_evento INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (id_evento, id_usuario)
);
