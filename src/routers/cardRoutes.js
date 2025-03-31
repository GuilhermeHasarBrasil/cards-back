const express = require('express');
const { criarCard, editarCard, listarCards, finalizarCard, addUsuarioCard, excluirCard, removeUserPointsOnReopenCard, addUserPointsOnReopenCard, editarConfigsCards } = require('../controllers/cardController');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, criarCard);
router.put('/:id', authMiddleware, editarCard);
router.get('/getcards', authMiddleware, listarCards);
router.put('/:id/finalizar', authMiddleware, finalizarCard);
router.post('/addusuariocard', authMiddleware, addUsuarioCard);
router.put('/excluircard/:id', excluirCard)
router.put('/reabrir/:userid', authMiddleware, removeUserPointsOnReopenCard)
router.put('/finalizar/:userid', authMiddleware, addUserPointsOnReopenCard)
router.put('/editarinfos/:id', authMiddleware, editarConfigsCards)

module.exports = router;
