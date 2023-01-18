import { StatusCodes } from 'http-status-codes';

import Order from '../models/Order.js';
import asyncWrapper from '../utils/asyncWrapper.js';
import NotFoundError from '../errors/notFound.js';

exports.getAllOrders = asyncWrapper(async (req, res, next) => {
  const orders = await Order.find();

  res.status(StatusCodes.OK).json({
    status: 'success',
    requestedAt: req.requestTime,
    counts: orders.length,
    orders,
  });
});

exports.getOrder = asyncWrapper(async (req, res, next) => {
  const { id: orderID } = req.params;

  const order = await Order.findById(orderID);

  if (!order) {
    return next(
      new NotFoundError(`No order found with the given ID : ${orderID}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    order,
  });
});

exports.getUserOrder = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.user;

  const orders = await Order.find({ user: userID });

  res.status(StatusCodes.OK).json({
    status: 'success',
    orders,
  });
});

exports.createOrder = asyncWrapper(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const order = await Order.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    order,
  });
});

exports.updateOrder = asyncWrapper(async (req, res, next) => {
  const { id: orderID } = req.params;

  const updOrder = await Order.findByIdAndUpdate(
    orderID,
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updOrder) {
    return next(
      new NotFoundError(`No order found with the given ID : ${orderID}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    order: updOrder,
  });
});

exports.deleteOrder = asyncWrapper(async (req, res, next) => {
  const { id: orderID } = req.params;

  const order = await Order.findByIdAndDelete(orderID);

  if (!order) {
    return next(
      new NotFoundError(`No order found with the given ID : ${orderID}`)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    order: null,
  });
});

exports.getMonthlyIncome = asyncWrapper(async (req, res, next) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  const income = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: prevMonth },
        ...(productId && { products: { $elemMatch: { productId } } }),
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
        sales: '$amount',
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: '$sales' },
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    status: 'success',
    income,
  });
});
