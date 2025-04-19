import express from 'express';
import { createOrder, getOrder, getAllOrders, updateOrderStatus, verifyPayment } from '../Controllers/oderController.js';
import {authMiddleware, isAdmin} from '../middlewares/userMiddleware.js';
const router = express.Router();

router.post('/oder/create', authMiddleware, createOrder);
router.get('/oder/:id', authMiddleware, getOrder);
router.post('/oder/:id/verify-payment', authMiddleware, verifyPayment);
router.get('/oder/all', isAdmin, getAllOrders);
router.put('/oder/:id/status', isAdmin, updateOrderStatus);

export default router;
