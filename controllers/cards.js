const Card = require('../models/card');
const { errorHandler } = require('../errors/forbidden');
const { NotFound, NotFoundError, InternalServerError } = require('../errors/unauthorized');
const { defaultErrorMessages } = require('../errors/forbidden');

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Карточка, с указанным id, не найдена',
      [InternalServerError]: 'На сервере произошла ошибка',
    }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Карточка, с указанным id, не найдена',
      [InternalServerError]: 'На сервере произошла ошибка',
    }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка, с указанным id, не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Карточка, с указанным id, не найдена',
      [InternalServerError]: 'На сервере произошла ошибка при удалении карточки',
    }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка, с указанным id, не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Карточка, с указанным id, не найдена',
      [InternalServerError]: 'На сервере произошла ошибка',
    }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFound).send({ message: 'Карточка, с указанным id, не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Карточка, с указанным id, не найдена',
      [InternalServerError]: 'На сервере произошла ошибка',
    }));
};
