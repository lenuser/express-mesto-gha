const { createUser } = require("../controllers/users");
const router = require ("express").Router();
const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../constants/constants');

router.post('/', celebrate({
  body: Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().pattern(urlRegex),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(3),
}).unknown(true),}),
 createUser);
 module.exports = router;