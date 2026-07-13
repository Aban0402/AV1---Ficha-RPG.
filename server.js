const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

const saltRounds = 10;
let db;

// Inicializa a conexão com o banco e CRIA as tabelas se não existirem
async function iniciarBanco() {
    try {
        db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });
        console.log("Banco de dados conectado!");

        // Garante a criação da tabela de usuários
        await db.exec(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha_hash TEXT NOT NULL
            );
        `);

        // Garante a criação da tabela de fichas
        await db.exec(`
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
        `);
        console.log("Tabelas verificadas/criadas no banco de dados com sucesso!");
    } catch (err) {
        console.error("Erro fatal ao iniciar banco de dados:", err);
    }
}
iniciarBanco();

// ROTA: Cadastro de usuário
app.post('/api/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }
    try {
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        const resultado = await db.run(
            `INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)`,
            [nome, email, senhaHash]
        );
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!", usuarioId: resultado.lastID });
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.status(400).json({ erro: "Este e-mail já está cadastrado." });
        }
        res.status(500).json({ erro: "Erro ao cadastrar usuário." });
    }
});

// ROTA: Login de Usuário (Valida e devolve o ID para criar a sessão)
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
    }

    try {
        const usuario = await db.get(`SELECT * FROM usuarios WHERE email = ?`, [email]);

        if (!usuario) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }

        res.json({
            mensagem: "Login efetuado com sucesso!",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao processar o login." });
    }
});

// ROTA: Salvar ficha (para visitante ou usuário logado)
app.post('/api/fichas', async (req, res) => {
    const { sistema, nome, raca, classe, atributos, usuarioId } = req.body;
    try {
        const idDono = usuarioId ? Number(usuarioId) : null;
        const atributosString = JSON.stringify(atributos || {});

        const resultado = await db.run(`
            INSERT INTO fichas_rpg (sistema, nome, raca, classe, atributos, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [sistema, nome, raca, classe, atributosString, idDono]);

        res.status(201).json({
            mensagem: idDono ? "Ficha salva na sua conta!" : "Ficha de visitante criada com sucesso!",
            idFicha: resultado.lastID
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao salvar ficha no banco." });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});