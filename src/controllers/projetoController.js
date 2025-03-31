const connection = require('../dbStrategy/postgres');

// Criar um novo projeto
const criarProjeto = async (req, res) => {
    const { nome, descricao } = req.body;
    try {
        const result = await connection.query(
            'INSERT INTO projetos (nome, descricao) VALUES ($1, $2) RETURNING *',
            [nome, descricao]
        );
        res.status(201).json({ message: 'Projeto criado com sucesso', projeto: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar projeto' });
    }
};

// Listar todos os projetos
const listarProjetos = async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM projetos ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar projetos' });
    }
};

// Editar um projeto (apenas admin)
const editarProjeto = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    try {
        const result = await connection.query(
            'UPDATE projetos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
            [nome, descricao, id]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: 'Projeto não encontrado' });

        res.json({ message: 'Projeto atualizado', projeto: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao editar projeto' });
    }
};

// Deletar um projeto (apenas admin)
const deletarProjeto = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await connection.query('DELETE FROM projetos WHERE id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Projeto não encontrado' });

        res.json({ message: 'Projeto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar projeto' });
    }
};

module.exports = {
    criarProjeto,
    listarProjetos,
    editarProjeto,
    deletarProjeto,
}