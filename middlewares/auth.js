const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized ({ message: 'Необходима авторизация' });
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'mesto-key');
  } catch (err) {
    throw new Unauthorized ({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
