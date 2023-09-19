const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const helmer = require('halmet');
const ratelimit = require('express-rate-limit');


const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
const limiter = ratelimit ({
  windowMs: 15*60*1000,
  max: 100,
});
app.use(limiter);
app.use(helmer());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(router);

app.use(errors());

app.use((err, req, res, next) => {

  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({

      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
    next();
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
