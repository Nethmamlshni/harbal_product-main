import express from 'express';
import { sendOrderConfirmation,
    sendShippingNotification,
    sendDeliveryConfirmation,
    sendNewsletterSubscriptionEmail,
    sendSpecialPromotionEmail,
    sendNewOrderNotification,
    sendLowStockAlert,
    sendContactFormSubmission } from '../Controllers/emailController.js';

import { authMiddleware, isAdmin } from '../middlewares/userMiddleware.js';    

const router = express.Router();

router.post('/order/:id',authMiddleware,isAdmin, sendOrderConfirmation);
router.post('/shipping/:id',authMiddleware,isAdmin, sendShippingNotification);
router.post('/delivery/:id',authMiddleware,isAdmin, sendDeliveryConfirmation);
router.post('/newsletter', authMiddleware,isAdmin,sendNewsletterSubscriptionEmail);
router.post('/promotion',authMiddleware,isAdmin, sendSpecialPromotionEmail);

router.post('/admin/new-order/:id',authMiddleware,isAdmin, sendNewOrderNotification);
router.post('/admin/low-stock',authMiddleware,isAdmin, sendLowStockAlert);
router.post('/admin/contact',authMiddleware,isAdmin, sendContactFormSubmission);


export default router;