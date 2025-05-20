const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    const error = new Error('Token manquant');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1]; // Authorization: Bearer <token>
  if (!token) {
    const error = new Error('Token manquant');
    error.statusCode = 401;
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const error = new Error('Token invalide');
      error.statusCode = 403;
      return next(error);
    }

    req.user = user;
    next();
  });
}

module.exports = verifyToken;
