const express = require('express');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const signup = require('../routes/signup');
const signuin = require('../routes/signin');
const NotFoundError = require ('../errors/not-found-err')

const router = express.Router();

router
  .use('/users',auth, users)
  .use('/cards',auth, cards)
  .use('/signup',auth, signup)
  .use('/signup',auth, signuin)

  .use('*', (req, res, next) => {
  next (new NotFoundError ('Страница не найдена' ));
  });

module.exports = router;
