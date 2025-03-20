const express = require('express');
const { criarProjeto, listarProjetos, editarProjeto, deletarProjeto } = require('../controllers/projetoController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, criarProjeto); // Apenas admin pode criar
router.get('/', authMiddleware, listarProjetos); // Qualquer usuário autenticado pode listar
router.put('/:id', authMiddleware, adminMiddleware, editarProjeto); // Apenas admin pode editar
router.delete('/:id', authMiddleware, adminMiddleware, deletarProjeto); // Apenas admin pode deletar

module.exports = router;
