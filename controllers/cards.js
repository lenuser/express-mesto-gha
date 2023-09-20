const Card = require('../models/card');
const { default: mongoose } = require('mongoose');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const forbidden = require('../errors/forbidden');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
      .orFail()
      .populate('owner')
      .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
      .catch((err) => {
        if (err instanceof mongoose.Error.DocumentNotFoundError){
          next (new NotFoundError('Карточка с указанным id не найдена'))
        } else {
          next(err);
        }
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next (new BadRequestError(err.message));
      } else {
        next(err);
      }
    })
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

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)){
        throw new forbidden('Карточка другого пользователя');
      }
      Card.deleteOne(card)
      .orFail()
      .then(() => {
      res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена'})
    })
      .catch((err) => {
        if (err instanceof mongoose.Error.DocumentNotFoundError){
          next (new NotFoundError('Карточка с указанным id не найдена'))
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next (new NotFoundError('Неверный id'));
        } else {
          next(err);
        }
      });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next (new NotFoundError('Карточка с указанным id не найдена'));
      } else {
        next(err);
      }
    })
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
