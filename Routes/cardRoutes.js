import express from 'express';
import { addToCart, getCart, removeFromCart } from '../Controllers/cardController.js';

const router = express.Router();

// Route to add a product to the cart
router.post('/card', addToCart);

// Route to get the cart details
router.get('/card', getCart);

// Route to remove an item from the cart
router.delete('/removecard', removeFromCart);

export default router;
