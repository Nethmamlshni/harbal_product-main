import e from 'express';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  state: { type: String, enum: ['solid', 'oil', 'powder', 'liquid'], required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  tags: [{ type: String }],
  images: [{ type: String }],
  ingredients: { type: String },
  benefits: { type: String },
  usageInstructions: { type: String },
  shelfLife: { type: String },
  expiryDate: { type: Date },
  weight: { type: String },
  organicCertification: { type: Boolean, default: false },
  origin: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
