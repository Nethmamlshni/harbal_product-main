import nodemailer from 'nodemailer';
import Order from '../Models/Order.js';
import User from '../Models/User.js';

// Create a nodemailer transporter for SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Send order confirmation email
exports.sendOrderConfirmation = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('userId');
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Order Confirmation',
      text: `Your order #${orderId} has been confirmed!`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent');
  } catch (error) {
    console.log('Error sending order confirmation email: ', error);
  }
};

// Send shipping notification email
exports.sendShippingNotification = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('userId');
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Shipping Notification',
      text: `Your order #${orderId} has been shipped!`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Shipping notification email sent');
  } catch (error) {
    console.log('Error sending shipping notification email: ', error);
  }
};

// Send delivery confirmation email
exports.sendDeliveryConfirmation = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('userId');
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Delivery Confirmation',
      text: `Your order #${orderId} has been delivered!`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Delivery confirmation email sent');
  } catch (error) {
    console.log('Error sending delivery confirmation email: ', error);
  }
};
