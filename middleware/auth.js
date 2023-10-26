const jwt = require('jsonwebtoken');
const config = require('../config');

const { secret } = config;

module.exports = () => (req, resp, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }

  const {
    email,
    password,
    role,
  } = req.body;

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    if (decodedToken.user.email === email && decodedToken.user.password === password
      && decodedToken.user.role === role) {
      return next();
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
  });
};

module.exports.isAuthenticated = (req) => (
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  false
);

module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuaria es admin
  false
);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
