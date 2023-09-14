const User = require('../models/user');
const { errorHandler } = require('./errorHandler');
const { NotFoundError, InternalServerError } = require('./errorCodes');
const { defaultErrorMessages } = require('./errorHandler');

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Не найдено',
      [InternalServerError]: 'Ошибка при создании пользователя',
    }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Пользователь по указанному Id не найден',
      [InternalServerError]: 'На сервере произошла ошибка',
    }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(404).send({
          message:
          'Пользователь по указанному Id не найден',
        });
      }
    })
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Пользователь по указанному Id не найден',
      [InternalServerError]: 'На сервере произошла ошибка',
    }));
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: 'true', runValidators: true },
  )
    .then((user) => (res.send({ data: user })))
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Пользователь по указанному Id не найден',
      [InternalServerError]: 'На сервере произошла ошибка',
    }));
};

module.exports.editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: 'true', runValidators: true },
  )
    .then((user) => (res.send({ data: user })))
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Пользователь по указанному Id не найден',
      [InternalServerError]: 'На сервере произошла ошибка',
    }));
};
