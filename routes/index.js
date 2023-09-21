const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const signup = require('./signup');
const signin = require('./signin');
const NotFoundError = require('../errors/not-found-err');

router.use(auth);
router.use('/users', users);
router.use('/cards', cards);
router.use('/signup', signup);
router.use('/signin', signin);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
