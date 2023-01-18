import _ from 'lodash';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { StatusCodes } from 'http-status-codes';

import User from '../models/User.js';
import sendEmail from '../utils/email.js';
import NotFoundError from '../errors/notFound.js';
import asyncWrapper from '../utils/asyncWrapper.js';
import ForbiddenError from '../errors/forbidden.js';
import BadRequestError from '../errors/badRequest.js';
import CustomAPIError from '../errors/customApiError.js';
import createSendToken from '../middlewares/createSendToken.js';
import UnauthenticatedError from '../errors/unauthenticated.js';

exports.register = asyncWrapper(async (req, res, next) => {
  const newUser = _.pick(req.body, [
    'img',
    'name',
    'username',
    'email',
    'role',
    'password',
    'passwordConfirm',
    'passwordChangedAt',
  ]);

  const user = await User.create({ ...newUser });

  createSendToken(user, StatusCodes.CREATED, res);
});

exports.login = asyncWrapper(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new BadRequestError('Please provide username and password'));
  }

  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new UnauthenticatedError('Incorrect username or password'));
  }

  createSendToken(user, StatusCodes.OK, res);
});

exports.protect = asyncWrapper(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  // token verification
  if (!token) {
    return next(
      new UnauthenticatedError(
        'You are not logged in! Please log in to get access'
      )
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new UnauthenticatedError(
        'The user belonging to this token does no longer exist'
      )
    );
  }

  // check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new UnauthenticatedError(
        'User recently changed password! Please log in again'
      )
    );
  }

  // grant access to protected routes
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError('You do not have permission to perform this action')
      );
    }
    next();
  };
};

exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new BadRequestError('Please enter your email address'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new NotFoundError('There is no user with email address'));
  }

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `
    Forgot your password? Submit a PATCH request with your new password and 
    passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, 
    please ignore this email!
  `;

  const html = `
    <h1>Hello ${user.firstName},</h1>
    <p>Forgot your password?</p>
    <p>
      Submit a PATCH request with your new password and 
      passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, 
      please ignore this email!
    </p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
      html,
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: `Token sent to email: ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new CustomAPIError(
        'There was an error sending the email. Try again later!'
      )
    );
  }
});

exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetpasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new BadRequestError('Token is invalid or has expired'));
  }

  const { password, passwordConfirm } = req.body;

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  createSendToken(user, StatusCodes.OK, res);
});

exports.updatePassword = asyncWrapper(async (req, res, next) => {
  const { password, passwordConfirm, passwordCurrent } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(passwordCurrent))) {
    return next(new UnauthenticatedError('Your current password is wrong'));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createSendToken(user, StatusCodes.OK, res);
});
