import Cart from '../Models/Card.js';
import Product from '../Models/Product.js';

// Add product to cart (handles both logged-in and guest users)
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
    await cart.save(); // Save the cart to the database

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error); // Debugging
    res.status(400).json({ message: error.message });
  }
};

//  Get cart details (handles both logged-in and guest users)
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) {
      console.log('No cart found for user, returning empty cart'); // Debugging
      return res.status(200).json({ items: [], totalPrice: 0 });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error retrieving cart:', error); // Debugging
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
    const guestItems = req.session.cart?.items || req.body.guestCartItems;

    if (!req.user || !guestItems || guestItems.length === 0) {
      return res.status(400).json({ message: 'No guest cart to merge' });
    }

    let userCart = await Cart.findOne({ userId: req.user.id });
    if (!userCart) {
      userCart = new Cart({ userId: req.user.id, items: [], totalPrice: 0 });
    }

    guestItems.forEach(guestItem => {
      const itemIndex = userCart.items.findIndex(
        item => item.productId.toString() === guestItem.productId.toString()
      );

      if (itemIndex >= 0) {
        // Update the quantity of the existing item
        userCart.items[itemIndex].quantity += guestItem.quantity;
      } else {
        // Add the guest item to the user cart
        userCart.items.push({
          productId: guestItem.productId,
          quantity: guestItem.quantity,
          price: guestItem.price,
        });
      }
    });

    // Recalculate the total price
    userCart.totalPrice = userCart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await userCart.save();

    res.status(200).json({ message: 'Cart merged successfully', cart: userCart });
  } catch (error) {
    console.error('Error merging carts:', error.message); // Debugging
    res.status(400).json({ message: error.message });
  }
};