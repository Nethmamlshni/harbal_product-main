import Cart from '../Models/Card.js';
import Product from '../Models/Product.js';

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.price });
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get cart details
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items.splice(itemIndex, 1);
      cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
