const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../constants/constants')
const {
  getUserById, getUsers, updateUser, updateAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);

router.get('/:userId', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex),
  }),
}), updateAvatar);

module.exports = router;
