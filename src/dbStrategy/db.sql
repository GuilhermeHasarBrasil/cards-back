CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    administrador BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projetos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL,
    projeto_id INT REFERENCES projetos(id) ON DELETE SET NULL,
    pontuacao INT DEFAULT NULL,
    prazo TIMESTAMP,
    finalizado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    finalizado_em TIMESTAMP DEFAULT NULL
);

CREATE TABLE cards_usuarios (
    id SERIAL PRIMARY KEY,
    card_id INT REFERENCES cards(id) ON DELETE CASCADE,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE
);

alter table cards add column usuarios TEXT[];
alter table cards add column titulo TEXT;
alter table cards add column status_card TEXT;
alter table usuarios add column score integer default 0;
