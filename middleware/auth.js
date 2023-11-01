const jwt = require('jsonwebtoken');

const requiredAuth = (secret) => (req, resp, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization.length === 2) {
      resp.status(400).send('Invalid token');
    }

    if (!authorization.split(' ')[0] === 'Bearer') {
      resp.status(400).send('Invalid token format');
    }
    const token = authorization.split(' ')[1];
    const tokenVerify = jwt.verify(token, secret);
    req.user = tokenVerify.email;
    req.role = tokenVerify.role;
    next();
  } catch (error) {
    resp.status(401).json({ error: 'Not Authorized' });
  }
};

const isAdmin = (req, resp, next) => {
  const { role } = req;
  if (role === 'admin') {
    next();
  } else {
    resp.status(403).send({ error: 'Role must be admin' });
  }
};

module.exports = {
  requiredAuth,
  isAdmin,
};

// module.exports = () => (req, resp, next) => {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     console.info('Authorization header missing');
//     return next();
//   }

//   const [type, token] = authorization.split(' ');

//   if (type.toLowerCase() !== 'bearer') {
//     console.warn('Invalid authorization type');
//     return next();
//   }

//   jwt.verify(token, secret, (err, decodedToken) => {
//     if (err) {
//       console.error('Token verification failed:', err);
//       return resp.status(403).send('Acesso proibido');
//     }

//     console.info('Token verified:', decodedToken);
//     req.user = decodedToken;
//     next();
//   });
// };

// module.exports.isAuthenticated = (req) => (
//   // TODO: decidir por la informacion del request si la usuaria esta autenticada
//   false
// );

// module.exports.isAdmin = (req) => (
//   // TODO: decidir por la informacion del request si la usuaria es admin
//   false
// );

// module.exports.requireAuth = (req, resp, next) => (
//   (!module.exports.isAuthenticated(req))
//     ? next(401)
//     : next()
// );

// module.exports.requireAdmin = (req, resp, next) => (
//   // eslint-disable-next-line no-nested-ternary
//   (!module.exports.isAuthenticated(req))
//     ? next(401)
//     : (!module.exports.isAdmin(req))
//       ? next(403)
//       : next()
// );
