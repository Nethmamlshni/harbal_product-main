import express from 'express';
import { createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    addComment,
    searchPosts, } from '../Controllers/blogController.js';
import {authMiddleware} from '../middlewares/userMiddleware.js';

const router = express.Router();

router.get('/blogs/search', searchPosts); 
router.get('/blogs', getAllPosts);  
router.get('/blogs/:id', getPostById);  
router.post('/blogs/create', authMiddleware, createPost);  
router.put('/blogs/update/:id', authMiddleware, updatePost); 
router.delete('/blogs/delete/:id', authMiddleware,  deletePost); 
router.post('/blogs/comment', authMiddleware, addComment); 



export default router;