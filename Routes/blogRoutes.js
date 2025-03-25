import express from 'express';
import { createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    addComment,
    searchPosts, } from '../Controllers/blogController.js';
import {authMiddleware, isAdmin} from '../middlewares/userMiddleware.js';

const router = express.Router();

router.get('/', getAllPosts);  
router.get('/:id', getPostById); 
router.get('/search', searchPosts);  
router.post('/create', authMiddleware, isAdmin, createPost);  
router.put('/update/:id', authMiddleware, isAdmin, updatePost); 
router.delete('/delete/:id', authMiddleware, isAdmin, deletePost); 
router.post('/comment', authMiddleware, addComment); 



export default router;