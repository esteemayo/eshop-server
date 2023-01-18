import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import * as productController from '../controllers/productController.js';

const router = express.Router();

router.get('/search', productController.searchProduct);

router.get('/details/:slug', productController.getProductBySlug);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    productController.deleteProduct
  );

export default router;
