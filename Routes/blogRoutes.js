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

router.get('/blog', getAllPosts);  
router.get('/blog/:id', getPostById); 
router.get('/blog/search', searchPosts);  
router.post('/blog/create', authMiddleware, isAdmin, createPost);  
router.put('/blog/update/:id', authMiddleware, isAdmin, updatePost); 
router.delete('/blog/delete/:id', authMiddleware, isAdmin, deletePost); 
router.post('/blog/comment', authMiddleware, addComment); 



export default router;