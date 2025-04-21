import Order from '../Models/Oder.js';
import Cart from '../Models/Card.js';
import Product from '../Models/Product.js';
import Address from '../Models/Address.js';


// tax and shipping fees
const calculateTaxAndShipping = (totalPrice) => {
  const taxRate = 0.1; // 10% tax
  const shippingCost = totalPrice > 5000 ? 0 : 500; // Free shipping over 5000
  return {
    tax: totalPrice * taxRate,
    shippingCost: shippingCost,
  };
};

// Create an order from the cart
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Product ${product.name} is out of stock` });
      }
    }

    const shippingAddress = await Address.findById(req.body.shippingAddress);
    const billingAddress = req.body.billingAddress ? await Address.findById(req.body.billingAddress) : null;
    if (!shippingAddress) return res.status(400).json({ message: 'Invalid shipping address' });

    const { tax, shippingCost } = calculateTaxAndShipping(cart.totalPrice);

    const order = new Order({
      userId: req.user.id,
      items: cart.items,
      shippingAddress: shippingAddress._id,
      billingAddress: billingAddress ? billingAddress._id : null,
      shippingMethod: req.body.shippingMethod || 'standard',
      paymentMethod: req.body.paymentMethod || 'creditCard',
      totalPrice: cart.totalPrice + tax + shippingCost,
      tax,
      shippingCost,
    });
    await order.save();
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get order details
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('items.productId')
      .populate('shippingAddress')

      if (!order) {
        console.log('Order not found'); // Debugging
        return res.status(404).json({ message: 'Order not found' });
      }
     
      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order:', error.message); // Debugging
      res.status(400).json({ message: error.message });
    }
  };

// Get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('shippingAddress')
      .populate('userId', 'firstname lastname email') // Populate user details
      .populate('items.productId'); // Correctly populate productId

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify payment before confirming order
export const verifyPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.body.paymentStatus === 'paid') {
      order.paymentStatus = 'paid';
      await order.save();
      res.status(200).json({ message: 'Payment verified successfully', order });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
