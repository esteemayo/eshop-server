const express = require('express');

const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

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

module.exports = router;
