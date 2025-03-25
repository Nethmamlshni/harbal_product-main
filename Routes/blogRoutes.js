import express from 'express';
import { createPost,getAllPosts, getPostById, updatePost, deletePost, addComment, getComments } from '../Controllers/blogController.js';

const router = express.Router();

router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);
router.post('/comments', addComment);
router.get('/comments/:id', getComments);




export default router;