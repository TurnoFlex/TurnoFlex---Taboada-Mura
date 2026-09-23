const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Acceso denegado. No se proporcionó un token de autenticación.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'turnoflex_super_secret_jwt_key_2026', (err, user) => {
    if (err) {
      return res.status(401).json({
        error: 'Token inválido o expirado.'
      });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
