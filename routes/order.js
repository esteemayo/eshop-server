import express from 'express';

import * as authController from '../controllers/authController.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.use(authController.protect);

router.get('/my-orders', orderController.getUserOrder);

router.get(
  '/income',
  authController.restrictTo('admin'),
  orderController.getMonthlyIncome
);

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(authController.restrictTo('admin'), orderController.updateOrder)
  .delete(orderController.deleteOrder);

export default router;
