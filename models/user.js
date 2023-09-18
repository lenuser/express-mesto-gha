const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поледолжно быть заполнено'],
    minlength: [2, 'Минимальная длина имени — 2 символа'],
    maxlength: [30, 'Максимальная — 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Поледолжно быть заполнено'],
    minlength: [2, 'Минимальная длина поля — 2 символа'],
    maxlength: [30, 'Максимальная длина поля — 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'Поледолжно быть заполнено'],
    validate: {
      validator(url) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url);
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
module.exports = mongoose.model('user', userSchema);
