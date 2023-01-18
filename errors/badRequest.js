import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customApiError.js';

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.BAD_REQUEST;
    this.status = 'fail';
  }
}

export default BadRequestError;
