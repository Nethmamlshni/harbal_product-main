import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  availability: { type: String, enum: ['standard', 'express'], default: 'standard' },
  paymentMethod: { type: String, enum: ['creditCard', 'debitCard', 'cashOnDelivery'], default: 'creditCard' },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'], default: 'pending' },
  totalPrice: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
