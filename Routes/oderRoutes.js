import express from 'express';
import { createOrder, getOrder, getAllOrders, updateOrderStatus, verifyPayment } from '../Controllers/oderController.js';
import {authMiddleware, isAdmin} from '../middlewares/userMiddleware.js';
const router = express.Router();


router.get('/oder/add',authMiddleware, isAdmin, getAllOrders);
router.post('/oder/create', authMiddleware, createOrder);
router.get('/oder/:id', authMiddleware, getOrder);
router.post('/oder/verify-payment/:id', authMiddleware, verifyPayment);
router.put('/oder/status/:id',authMiddleware, isAdmin, updateOrderStatus);

export default router;
