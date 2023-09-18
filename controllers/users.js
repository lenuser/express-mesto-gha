const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: { user } }))
    .catch((error) => {
      if (error.code === 11000) {
        throw new ConflictError('Такой email уже существует');
      }
      next(error);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.status(200).send({ data: user });
      else {
        throw new NotFoundError('Пользователь по указанному Id не найден');
      }
    })
    .catch(next);
};

module.exports.editUserData = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => (res.send({ data: user })))
    .catch(next);
};

module.exports.editUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true, runValidators: true })
    .then((user) => (res.send({ data: user })))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Неверные пароль/почта');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadRequestError('Неверные пароль/почта');
          }

          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '10d' });

      res.send({ token });
    })
    .catch(next);
};
