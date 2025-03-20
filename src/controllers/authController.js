const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../dbStrategy/postgres');

const register = async (req, res) => {
    const { nome, email, senha } = req.body;
    console.log(nome, email, senha);
    const hash = await bcrypt.hash(senha, 10);

    try {
        const result = await connection.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
            [nome, email, hash]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await connection.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ message: 'Usuário não encontrado' });

        const usuario = result.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return res.status(400).json({ message: 'Senha incorreta' });

        const token = jwt.sign({ id: usuario.id, administrador: usuario.administrador }, 'secreto', { expiresIn: '1h' });
        res.json({ token : token, user: usuario });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao logar' });
    }
};

const getUsers = async (req, res) => {

    try {
        //busca os usuarios e retorna
        const result = await connection.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar usuarios' });
    }
};

module.exports = {
    register,
    login,
    getUsers
};