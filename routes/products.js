import express from 'express';

import * as authController from '../controllers/authController.js';
import * as productController from '../controllers/productController.js';

const router = express.Router();

router.get('/search', productController.searchProduct);

router.get('/details/:slug', productController.getProductBySlug);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

export default router;
