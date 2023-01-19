import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';

import User from '../models/User.js';
import asyncWrapper from '../utils/asyncWrapper.js';
import factory from './handlerFactory.js';
import createSendToken from '../utils/createSendToken.js';
import BadRequestError from '../errors/badRequest.js';

export const updateMe = asyncWrapper(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  if (password || passwordConfirm) {
    return next(
      new BadRequestError(
        `This route is not for password updates. Please use update ${req.protocol
        }://${req.get('host')}/api/v1/auth/update-my-password`
      )
    );
  }

  const filterBody = _.pick(req.body, ['name', 'username', 'email']);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: filterBody },
    {
      new: true,
      runValidators: true,
    }
  );

  createSendToken(updatedUser, StatusCodes.OK, res);
});

export const deleteMe = asyncWrapper(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    user: null,
  });
});

export const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query.new;

  const users = query
    ? await User.find().sort('-_id').limit(5)
    : await User.find();

  res.status(StatusCodes.OK).json({
    status: 'success',
    requestedAt: req.requestTime,
    counts: users.length,
    users,
  });
});

export const getUserStats = asyncWrapper(async (req, res, next) => {
  const stats = await User.getUserStats();

  res.status(StatusCodes.OK).json({
    status: 'success',
    stats,
  });
});

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    message: `This route is not defined! Please use ${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/register instead`,
  });
};

export const getUser = factory.getOneById(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
