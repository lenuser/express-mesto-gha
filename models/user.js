const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const  unauthorized = require('../errors/unauthorized');
const urlRegex = require('../constants/constants');
const Forbidden = require('../errors/forbidden');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина имени — 2 символа'],
    maxlength: [30, 'Максимальная — 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля — 2 символа'],
    maxlength: [30, 'Максимальная длина поля — 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return urlRegex.test(v);
      },
      message: (props) => `${props.value} некорректная ссылка!`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} некорректный e-mail`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
  .select('+password')
    .then((user) => {
      if (!user) {
       // throw new Forbidden ('Неправильные почта или пароль');
       throw new unauthorized ('Такой пользователь уже существует');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new unauthorized ('Неправильные почта или пароль');
          }
          return user;
        });
    });
};


module.exports = mongoose.model('user', userSchema);
