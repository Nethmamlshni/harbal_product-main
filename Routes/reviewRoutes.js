import express from 'express';
import { createReview, getReviewsForProduct } from '../Controllers/reviewController.js';
import { authMiddleware } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/product/:productId', getReviewsForProduct);

export default router;