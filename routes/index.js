const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const signup = require('./signup');
const signin = require('./signin');
const NotFoundError = require('../errors/not-found-err');

router
  .use('/users', auth, users)
  .use('/cards', auth, cards)
  .use('/signup', auth, signup)
  .use('/signin', auth, signin)

  .use('*', (req, res, next) => {
    next(new NotFoundError('Страница не найдена'));
  });

module.exports = router;
