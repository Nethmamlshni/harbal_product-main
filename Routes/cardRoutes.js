import express from 'express';
import { addToCart, getCart, removeFromCart, mergeCarts } from '../Controllers/cardController.js';
import { authMiddleware } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.post('/cards', authMiddleware, addToCart);
router.get('/cart', authMiddleware, getCart);
router.delete('/removecard', authMiddleware, removeFromCart);
router.put('/mergecard',authMiddleware, mergeCarts);

export default router;
