const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById, getUsers, updateUser, updateAvatar, getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), updateAvatar);

module.exports = router;
