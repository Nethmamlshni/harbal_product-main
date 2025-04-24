// routes/commentRoutes.js
import express from 'express';
import {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
} from '../Controllers/commentController.js';

const router = express.Router();

router.post('/comment', createComment);
router.get('/comment', getAllComments);
router.get('/comment/:id', getCommentById);
router.put('/comment/:id', updateComment);
router.delete('/comment/:id', deleteComment);

export default router;
