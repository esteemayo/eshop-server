const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./customApiError');

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.BAD_REQUEST;
    this.status = 'fail';
  }
}

module.exports = BadRequestError;
