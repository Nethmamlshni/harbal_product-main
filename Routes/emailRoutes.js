import express from 'express';
import { sendOrderConfirmation, sendShippingNotification, sendDeliveryConfirmation } from '../Controllers/emailController.js';

const router = express.Router();

router.post('/send-order-confirmation', sendOrderConfirmation);
router.post('/send-shipping-notification', sendShippingNotification);
router.post('/send-delivery-confirmation', sendDeliveryConfirmation);

export default router;