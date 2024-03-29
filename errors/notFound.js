import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customApiError.js';

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.NOT_FOUND;
    this.status = 'fail';
  }
}

export default NotFoundError;
