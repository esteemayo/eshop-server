import { StatusCodes } from 'http-status-codes';

import Cart from '../models/Cart.js';
import asyncWrapper from '../utils/asyncWrapper.js';
import NotFoundError from '../errors/notFound.js';

export const getAllCarts = asyncWrapper(async (req, res, next) => {
  const carts = await Cart.find();

  res.status(StatusCodes.OK).json({
    status: 'success',
    requestedAt: req.requestTime,
    counts: carts.length,
    carts,
  });
});

export const getCart = asyncWrapper(async (req, res, next) => {
  const { id: cartID } = req.params;

  const cart = await Cart.findById(cartID);

  if (!cart) {
    return next(
      new NotFoundError(`No cart found with the given ID : ${cartID}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    cart,
  });
});

export const getUserCart = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.user;

  const cart = await Cart.find({ user: userID });
  // const cart = await Cart.findOne({ user: userID });

  if (!cart) {
    return next(
      new NotFoundError(`No cart found with the given user ID : ${userID}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    cart,
  });
});

export const createCart = asyncWrapper(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const cart = await Cart.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    cart,
  });
});

export const updateCart = asyncWrapper(async (req, res, next) => {
  const { id: cartID } = req.params;

  const updCart = await Cart.findByIdAndUpdate(
    cartID,
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updCart) {
    return next(
      new NotFoundError(`No cart found with the given ID : ${cartID}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    cart: updCart,
  });
});

export const deleteCart = asyncWrapper(async (req, res, next) => {
  const { id: cartID } = req.params;

  const cart = await Cart.findByIdAndDelete(cartID);

  if (!cart) {
    return next(
      new NotFoundError(`No cart found with the given ID : ${cartID}`)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    cart: null,
  });
});
