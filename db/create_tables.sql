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