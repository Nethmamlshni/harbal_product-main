import Review from '../Models/Review.js';
import mongoose from 'mongoose';

export const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        const newReview = new Review({
            product,
            user: req.user._id,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getReviewsForProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId }).populate('user', 'name');

        const avgRatingData = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: "$product", avgRating: { $avg: "$rating" } } }
        ]);

        const avgRating = avgRatingData.length ? avgRatingData[0].avgRating : 0;
        res.status(200).json({ reviews, avgRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};