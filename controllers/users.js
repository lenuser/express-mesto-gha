const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const { default: mongoose } = require('mongoose');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
  .orFail()
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user)
    })
    .catch((err) => {
    if (err instanceof mongoose.Error.CastError){
      next(new BadRequestError(`Не верный id: ${req.params.userId}`));
    } else if (err instanceof mongoose.Error.DocumentNotFoundError){
      next(new NotFoundError(`Пользователь по данному id: ${req.params.userId} не найден`));
    } else {
      next(err);
    }
  });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch(next);
};
//addUser
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    })
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      name:user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
    }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError(`пользователь с email: ${email} уже существует`));
      } else if (error instanceof mongoose.Error.ValidationError){
        next( new BadRequestError(err.message));
      } else {
      next(error);
    }
    }));
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => (res.send({ data: user })))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, { new: true, runValidators: true })
    .then((user) => (res.send({ data: user })))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'mesto-key', { expiresIn: '10d'});
      res.send({ token });
    })
    .catch((err) => {
     next(err)
    });
};

module.exports = {
  getUserById, getUsers, createUser, updateUser, updateAvatar, login, getUser,
};
