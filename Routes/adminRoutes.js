import express from 'express';
import {getAnalytics, viewAllProducts, viewAllOrders, updateOrderStatus} from '../Controllers/adminController.js';

const router = express.Router();

router.get('/analytics', getAnalytics);
router.get('/products', viewAllProducts);
router.get('/orders', viewAllOrders);
router.put('/orders/:id', updateOrderStatus);

export default router;