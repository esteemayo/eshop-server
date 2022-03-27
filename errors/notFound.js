const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./customApiError');

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.NOT_FOUND;
    this.status = 'fail';
  }
}

module.exports = NotFoundError;
