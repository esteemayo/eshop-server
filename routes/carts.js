import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/my-cart', cartController.getUserCart);

router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), cartController.getAllCarts)
  .post(cartController.createCart);

router
  .route('/:id')
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

export default router;
