const connection = require("../dbStrategy/postgres")

const criarCard = async (req, res) => {
    const { titulo, descricao, projeto_id, prazo, usuario_id, pontuacao, status } = req.body;

    console.log(req.body)
    const nomes = usuario_id.map(user => user.nome);

    try {
        let result

        if (!pontuacao) {
            result = await connection.query(
                'INSERT INTO cards (descricao, projeto_id, prazo, usuarios, titulo, status_card) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [descricao, projeto_id, prazo, nomes, titulo, status]
            );
        } else {
            result = await connection.query(
                'INSERT INTO cards (descricao, projeto_id, prazo, pontuacao, usuarios, titulo, status_card) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                [descricao, projeto_id, prazo, pontuacao, nomes, titulo, status]
            );
        }

        const card_id = result.rows[0].id;

        for (let i = 0; i < usuario_id.length; i++) {
            await connection.query('INSERT INTO cards_usuarios (card_id, usuario_id) VALUES ($1, $2)', [card_id, usuario_id[i].id]);
        }

        if (status === 'concluido') {

            let query = 'UPDATE cards SET descricao = $1, projeto_id = $2, prazo = $3, pontuacao = $4, finalizado = $5, status_card = $6 WHERE id = $7 RETURNING *';
            connection.query(query, [descricao, projeto_id, prazo, pontuacao, true, status, card_id]);
        }

        // await connection.query('INSERT INTO cards_usuarios (card_id, usuario_id) VALUES ($1, $2)', [card_id, usuario_id]);

        res.json({ message: 'Card criado com sucesso', card_id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro ao criar card' });
    }
};

const editarCard = async (req, res) => {
    const { id } = req.params;
    const { status_card } = req.body;

    try {
        let query = 'UPDATE cards SET status_card = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
        const result = await connection.query(query, [status_card, id]);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Card não encontrado' });

        res.json({ message: 'Card atualizado', card: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao editar card' });
    }
};

const editarConfigsCards = async (req, res) => {
    const { id } = req.params;
    const { pontuacao, prazo, titulo, descricao } = req.body;

    //update os dados que vierem na tabela de cards
    try {
        await connection.query('UPDATE cards SET pontuacao = $1, prazo = $2, titulo = $3, descricao = $4 WHERE id = $5', [pontuacao, prazo, titulo, descricao, id]);
        res.json({ message: 'Configs do card atualizados' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar configs do card', error: error.message });
    }
}

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

const excluirCard = async (req, res) => {
    const { id } = req.params;

    try {
        await connection.query("UPDATE cards SET status_card = 'excluido' WHERE id = $1", [id]);
        res.json({ message: 'Card excluído' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir card' });
    }
}

const removeUserPointsOnReopenCard = async (req, res) => {
    const { userid } = req.params;
    const {points} = req.body
    //remove pontos do user por reabrir o card
    try {
        await connection.query('UPDATE usuarios SET score = score - $1 WHERE id = $2', [points, userid]);
        res.json({ message: 'Pontos removidos do usuário' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover pontos do usuário' });
    }
}

const addUserPointsOnReopenCard = async (req, res) => {
    const { userid } = req.params;
    const {points} = req.body
    //remove pontos do user por reabrir o card
    try {
        await connection.query('UPDATE usuarios SET score = score + $1 WHERE id = $2', [points, userid]);
        res.json({ message: 'Pontos adicionados ao usuário' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao adicionar pontos do usuário' });
    }
}


module.exports = {
    criarCard,
    editarCard,
    listarCards,
    finalizarCard,
    addUsuarioCard,
    excluirCard,
    removeUserPointsOnReopenCard,
    addUserPointsOnReopenCard,
    editarConfigsCards
}