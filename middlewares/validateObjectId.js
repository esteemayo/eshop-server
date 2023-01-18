import mongoose from 'mongoose';
import NotFoundError from '../errors/notFound.js';

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid)
    return next(new NotFoundError('Invalid ID'));
  next();
};

export default validateObjectId;
