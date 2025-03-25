import express from 'express';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../Controllers/productController.js';

const router = express.Router();

router.post('/products', addProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
