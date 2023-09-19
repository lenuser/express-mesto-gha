const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../constants/constants');

const {
  addCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/',getCards);
router.delete('/:cardId',celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().require(),
  }),}),
 deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(urlRegex),
  }),}),
addCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().require(),
  }),}),
likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().require(),
  }),}),
dislikeCard);

module.exports = router;
