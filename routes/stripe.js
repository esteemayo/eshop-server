import express from 'express';
import * as stripeController from '../controllers/stripeController.js';

const router = express.Router();

router.post('/payment', stripeController.payment);

export default router;
