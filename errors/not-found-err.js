const { HTTP_NOT_FOUND_ERROR } = require('http2').constants;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_NOT_FOUND_ERROR;
  }
}

module.exports = NotFoundError;
