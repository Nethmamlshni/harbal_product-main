import express from 'express';
import { addToCart, getCart, removeFromCart, mergeCarts } from '../Controllers/cardController.js';

const router = express.Router();

router.post('/cards', addToCart);
router.get('/cart', getCart);
router.delete('/removecard', removeFromCart);
router.put('/mergecard', mergeCarts);

export default router;
