import express from 'express';
import { createOrder, getOrder, getAllOrders, updateOrderStatus, verifyPayment } from '../Controllers/oderController.js';
import {authMiddleware, isAdmin} from '../middlewares/userMiddleware.js';
const router = express.Router();

router.post('/create', authMiddleware, createOrder);
router.get('/:id', authMiddleware, getOrder);
router.post('/:id/verify-payment', authMiddleware, verifyPayment);
router.get('/', isAdmin, getAllOrders);
router.put('/:id/status', isAdmin, updateOrderStatus);

export default router;
