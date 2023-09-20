const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const signup = require('./signup');
const signin = require('./signin');
const NotFoundError = require('../errors/not-found-err');

router
  .use('/users', users)
  .use('/cards', cards)
  .use('/signup', signup)
  .use('/signin', signin)
  .use(auth)

  .use('*', (req, res, next) => {
    next(new NotFoundError('Страница не найдена'));
  });

module.exports = router;
