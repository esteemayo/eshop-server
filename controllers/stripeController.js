const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const asyncWrapper = require('../utils/asyncWrapper');
const CustomAPIError = require('../errors/customApiError');

exports.payment = asyncWrapper(async (req, res, next) => {
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
