import express from 'express';

import * as authController from '../controllers/authController.js';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

router.use(authController.protect);

router.get('/my-cart', cartController.getUserCart);

router
  .route('/')
  .get(authController.restrictTo('admin'), cartController.getAllCarts)
  .post(cartController.createCart);

router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

export default router;
