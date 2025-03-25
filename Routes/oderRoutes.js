import express from 'express';
import { createOrder, updateOrderStatus, verifyPayment } from '../Controllers/oderController.js';

const router = express.Router();

// Route to create an order
router.post('/oder', createOrder);

// Route to update order status
router.put('/status/:id', updateOrderStatus);

// Route to verify payment
router.post('/verify-payment/:id', verifyPayment);

export default router;
