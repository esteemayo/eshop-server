import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customApiError.js';

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.status = 'fail';
  }
}

export default UnauthenticatedError;
