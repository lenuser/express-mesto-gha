const express = require('express');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .use('/users', auth, users)
  .use('/cards', auth, cards)
  .use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

module.exports = router;
