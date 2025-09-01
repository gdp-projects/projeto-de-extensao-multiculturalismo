CREATE DATABASE eventos_feira;

USE eventos_feira;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    cpf CHAR(11) UNIQUE NULL,
    telefone VARCHAR(15) UNIQUE NULL,
    isPro TINYINT(1) DEFAULT 0,
    isOrganizer TINYINT(1) DEFAULT 0,
    CONSTRAINT chk_usuario_contato CHECK (cpf IS NOT NULL OR telefone IS NOT NULL)
);

CREATE TABLE local_evento (
    id_local INT AUTO_INCREMENT PRIMARY KEY,
    nome_local VARCHAR(150) NOT NULL,
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep CHAR(8),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);


CREATE TABLE evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_local INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    hora_evento TIME NOT NULL,
    status_evento ENUM('ativo','concluido','cancelado') DEFAULT 'ativo',
    capa_evento VARCHAR(255), -- imagem principal/cartaz
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_local) REFERENCES local_evento(id_local)
);

CREATE TABLE participacao (
    id_participacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    tipo ENUM('presenca','interesse') NOT NULL,
    status ENUM('confirmado','cancelado') DEFAULT 'confirmado',
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento),
    CONSTRAINT uk_participacao UNIQUE (id_usuario, id_evento, tipo) 
);
