const { HTTP_NOT_FOUND_ERROR } = require('http2').constants;

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_NOT_FOUND_ERROR;
  }
};
