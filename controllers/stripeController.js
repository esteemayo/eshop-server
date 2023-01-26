import Stripe from 'stripe';
import { StatusCodes } from 'http-status-codes';

import asyncWrapper from '../utils/asyncWrapper.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const payment = asyncWrapper(async (req, res, next) => {
  const stripeRes = await stripe.charges.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: 'usd',
  }, {
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  res.status(StatusCodes.OK).json(stripeRes);
});
