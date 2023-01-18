import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/update-me', userController.updateMe);

router.delete('/delete-me', userController.deleteMe);

router.get(
  '/stats',
  authMiddleware.restrictTo('admin'),
  userController.getUserStats
);

router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), userController.getAllUsers)
  .post(userController.createUser);

router.use(authMiddleware.restrictTo('admin'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
