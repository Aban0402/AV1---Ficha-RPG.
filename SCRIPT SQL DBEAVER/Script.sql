CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fichas_rpg (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sistema TEXT NOT NULL,
    nome TEXT NOT NULL,
    raca TEXT,
    classe TEXT,
    atributos TEXT,
    usuario_id INTEGER NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
);