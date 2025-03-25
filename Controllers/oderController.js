import Order from '../Models/Order.js';
import Cart from '../Models/Card.js';
import Product from '../Models/Product.js';

// Create an order from the cart
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const order = new Order({
      userId: req.user.id,
      items: cart.items,
      shippingAddress: req.body.shippingAddress,
      totalPrice: cart.totalPrice,
    });

    await order.save();

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Payment verification
exports.verifyPayment = async (req, res) => {
  // Implement payment gateway verification here
  res.status(200).json({ message: 'Payment verified successfully' });
};
