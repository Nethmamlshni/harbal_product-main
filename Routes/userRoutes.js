import express from 'express';
import { register, login, resetPassword, forgotPassword, getProfile, updateProfile , deleteProfile } from '../Controllers/userController.js';
import {authMiddleware} from '../middlewares/userMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/forgot-password',forgotPassword);
router.get('/profile', authMiddleware, getProfile);  
router.put('/profile', authMiddleware, updateProfile);
router.delete("/delete", authMiddleware, deleteProfile);

export default router;

//67f5efc920e7fe1e498e9c57