import express from 'express';
import { addAddress, getUserAddresses, updateAddress, deleteAddress } from '../Controllers/addressController.js';
import {authMiddleware} from '../middlewares/userMiddleware.js';

const router = express.Router();

router.post('/addresses', authMiddleware, addAddress);
router.get('/addresses', authMiddleware, getUserAddresses);
router.put('/addresses/:id', authMiddleware, updateAddress);
router.delete('/addresses/:id', authMiddleware, deleteAddress);

export default router;