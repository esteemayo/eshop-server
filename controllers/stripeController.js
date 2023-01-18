import stripe from 'stripe';
import { StatusCodes } from 'http-status-codes';

import asyncWrapper from '../utils/asyncWrapper';
import CustomAPIError from '../errors/customApiError';

stripe(process.env.STRIPE_SECRET_KEY);

export const payment = asyncWrapper(async (req, res, next) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        return next(new CustomAPIError(stripeErr));
      }
      return res.status(StatusCodes.OK).json(stripeRes);
    }
  );
});
