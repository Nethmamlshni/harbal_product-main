import express from 'express';
import { sendOrderConfirmation,
    sendShippingNotification,
    sendDeliveryConfirmation,
    sendPasswordResetEmail,
    sendNewsletterSubscriptionEmail,
    sendSpecialPromotionEmail,
    sendNewOrderNotification,
    sendLowStockAlert,
    sendContactFormSubmission } from '../Controllers/emailController.js';

const router = express.Router();

router.post('/order/:id', sendOrderConfirmation);
router.post('/shipping/:id', sendShippingNotification);
router.post('/delivery/:id', sendDeliveryConfirmation);
router.post('/password-reset', sendPasswordResetEmail);
router.post('/newsletter', sendNewsletterSubscriptionEmail);
router.post('/promotion', sendSpecialPromotionEmail);

router.post('/admin/new-order/:id', sendNewOrderNotification);
router.post('/admin/low-stock', sendLowStockAlert);
router.post('/admin/contact', sendContactFormSubmission);


export default router;