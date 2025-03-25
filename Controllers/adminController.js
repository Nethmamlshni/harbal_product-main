import Product from '../Models/Product.js';
import Order from '../Models/Order.js';
import BlogPost from '../Models/Blog.js';

// Get system analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalBlogPosts = await BlogPost.countDocuments();

    const analytics = {
      totalProducts,
      totalOrders,
      totalBlogPosts,
    };

    res.status(200).json(analytics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Manage products (View all products)
exports.viewAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// View all orders
exports.viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status (used by admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
