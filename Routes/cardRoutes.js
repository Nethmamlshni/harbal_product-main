import express from 'express';
import { addToCart, getCart, removeFromCart, mergeCarts } from '../Controllers/cardController.js';

const router = express.Router();

router.post('/card', addToCart);
router.get('/card', getCart);
router.delete('/removecard', removeFromCart);
router.put('/mergecard', mergeCarts);

export default router;
