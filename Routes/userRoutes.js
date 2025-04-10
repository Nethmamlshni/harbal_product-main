import express from 'express';
import { register, login, resetPassword, forgotPassword, getProfile, updateProfile , deleteProfile , getAllUsers} from '../Controllers/userController.js';
import {authMiddleware , isAdmin} from '../middlewares/userMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/forgot-password',forgotPassword);
router.get('/profile', authMiddleware, getProfile);  
router.put('/profile', authMiddleware, updateProfile);
router.delete("/delete", authMiddleware, deleteProfile);
router.get('/getall', isAdmin, getAllUsers);

export default router;
