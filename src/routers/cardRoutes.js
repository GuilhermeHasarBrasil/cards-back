const express = require('express');
const { criarCard, editarCard, listarCards, finalizarCard, addUsuarioCard } = require('../controllers/cardController');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, criarCard);
router.put('/:id', authMiddleware, editarCard);
router.get('/getcards', authMiddleware, listarCards);
router.put('/:id/finalizar', authMiddleware, finalizarCard);
router.post('/addusuariocard', authMiddleware, addUsuarioCard);

module.exports = router;
