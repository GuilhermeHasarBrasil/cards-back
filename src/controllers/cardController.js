const connection = require("../dbStrategy/postgres")

const criarCard = async (req, res) => {
    const { titulo, descricao, projeto_id, prazo, usuario_id, pontuacao } = req.body;

    try {
        let result

        if (!pontuacao) {
            result = await connection.query(
                'INSERT INTO cards (descricao, projeto_id, prazo, usuarios, titulo) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [descricao, projeto_id, prazo, [], titulo]
            );
        }else{
            result = await connection.query(
                'INSERT INTO cards (descricao, projeto_id, prazo, pontuacao, usuarios, titulo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [descricao, projeto_id, prazo, pontuacao, [], titulo]
            );
        }

        const card_id = result.rows[0].id;
        // await connection.query('INSERT INTO cards_usuarios (card_id, usuario_id) VALUES ($1, $2)', [card_id, usuario_id]);

        res.json({ message: 'Card criado com sucesso', card_id });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar card' });
    }
};

const editarCard = async (req, res) => {
    const { id } = req.params;
    const { descricao, projeto_id, prazo, pontuacao, finalizado } = req.body;
    const usuarioAdmin = req.usuario.administrador;

    try {
        let query = 'UPDATE cards SET descricao = $1, projeto_id = $2, prazo = $3, pontuacao = $4, finalizado = $5, updated_at = NOW() WHERE id = $6 RETURNING *';
        const result = await connection.query(query, [descricao, projeto_id, prazo, pontuacao, finalizado, id]);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Card não encontrado' });

        res.json({ message: 'Card atualizado', card: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao editar card' });
    }
};

const addUsuarioCard = async (req, res) => {
    const { card_id, usuario_id, usuario } = req.body;
    try {
        await connection.query('INSERT INTO cards_usuarios (card_id, usuario_id) VALUES ($1, $2)', [card_id, usuario_id]);
        await connection.query('UPDATE cards SET usuarios = array_append(usuarios, $1) WHERE id = $2;', [usuario, card_id])
        res.json({ message: 'Usuário adicionado ao card' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao adicionar usuário ao card' });
    }
}

const listarCards = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.*, 
                p.nome AS projeto_nome, 
                p.descricao AS projeto_descricao
            FROM cards c
            JOIN projetos p ON c.projeto_id = p.id
        `;

        const result = await connection.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cards', error: error.message });
    }
};

const finalizarCard = async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query('UPDATE cards SET finalizado = true, finalizado_em = NOW() WHERE id = $1', [id]);
        res.json({ message: 'Card finalizado' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao finalizar card' });
    }
};


module.exports = {
    criarCard,
    editarCard,
    listarCards,
    finalizarCard,
    addUsuarioCard
}