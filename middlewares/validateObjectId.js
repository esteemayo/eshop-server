const mongoose = require('mongoose');
const NotFoundError = require('../errors/notFound');

module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid)
    return next(new NotFoundError('Invalid ID'));
  next();
};
