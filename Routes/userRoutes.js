import express from 'express';
import { register, login, resetPassword, forgotPassword, getProfile, updateProfile , deleteProfile } from '../Controllers/userController.js';
import authMiddleware from '../middlewares/userMiddleware.js';

const Userrouter = express.Router();

Userrouter.post('/register', register);
Userrouter.post('/login', login);
Userrouter.post('/reset-password', resetPassword);
Userrouter.post('/forgot-password',forgotPassword);
Userrouter.get('/profile', authMiddleware, getProfile);  
Userrouter.put('/profile', authMiddleware, updateProfile);
Userrouter.delete("/delete", authMiddleware, deleteProfile);

export default Userrouter;
