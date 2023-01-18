import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customApiError.js';

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.FORBIDDEN;
    this.status = 'fail';
  }
}

export default ForbiddenError;
