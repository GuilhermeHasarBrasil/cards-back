const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Acesso negado' });

    const token = authHeader.split(' ')[1]; // Remove "Bearer "
    if (!token) return res.status(401).json({ message: 'Token inválido' });

    try {
        const decoded = jwt.verify(token, 'secreto');
        req.usuario = decoded; // Adiciona os dados do usuário ao request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.usuario || !req.usuario.administrador) {
        return res.status(403).json({ message: 'Acesso restrito a administradores' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
