import Cart from '../Models/Card.js';
import Product from '../Models/Product.js';

// Add product to cart (handles both logged-in and guest users)
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart;

    if (req.user) {
      
      cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) {
        cart = new Cart({ userId: req.user.id, items: [], totalPrice: 0 });
      }
    } else {
      
      cart = req.session.cart || { items: [], totalPrice: 0 };
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.price });
    }
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (req.user) {
      await cart.save(); 
    } else {
      req.session.cart = cart; 
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Get cart details (handles both logged-in and guest users)
export const getCart = async (req, res) => {
  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    } else {
      cart = req.session.cart || { items: [], totalPrice: 0 };
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart;

    if (req.user) {
      cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
    } else {
      cart = req.session.cart;
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items.splice(itemIndex, 1);
      cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      if (req.user) {
        await cart.save();
      } else {
        req.session.cart = cart;
      }

      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Merge guest cart with user cart upon login
export const mergeCarts = async (req, res) => {
  try {
    if (!req.user || !req.session.cart) {
      return res.status(400).json({ message: 'No guest cart to merge' });
    }

    let userCart = await Cart.findOne({ userId: req.user.id });
    if (!userCart) {
      userCart = new Cart({ userId: req.user.id, items: [], totalPrice: 0 });
    }

    req.session.cart.items.forEach(guestItem => {
      const itemIndex = userCart.items.findIndex(item => item.productId.toString() === guestItem.productId);
      if (itemIndex >= 0) {
        userCart.items[itemIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });

    userCart.totalPrice = userCart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    await userCart.save();
    req.session.cart = null; 

    res.status(200).json({ message: 'Cart merged successfully', cart: userCart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
