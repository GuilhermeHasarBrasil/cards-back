const express = require('express');
const { listarUsuarios } = require('../controllers/usuarioController');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, listarUsuarios);

module.exports = router;
