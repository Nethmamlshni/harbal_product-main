import express from 'express';
import {getAnalytics, viewAllProducts, viewAllOrders, updateOrderStatus,adminLink,adminRegister} from '../Controllers/adminController.js';

const router = express.Router();

router.post('/invite-admin', adminLink);
router.post('/register-admin', adminRegister);
router.get('/analytics', getAnalytics);
router.get('/products', viewAllProducts);
router.get('/orders', viewAllOrders);
router.put('/orders/:id', updateOrderStatus);

export default router;