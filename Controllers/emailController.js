import nodemailer from 'nodemailer';
import Order from '../Models/Oder.js';
import User from '../Models/User.js';

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: process.env.SERVER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Send Order Confirmation Email
export const sendOrderConfirmation = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('userId');
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: process.env.SERVER ,
      to: user.email,
      subject: 'Order Confirmation',
      text: `Your order #${orderId} has been confirmed!`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent');
  } catch (error) {
    console.log('Error sending order confirmation email:', error);
  }
};

// Send Shipping Notification Email
export const sendShippingNotification = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('userId');
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Shipping Notification',
      text: `Your order #${orderId} has been shipped!`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Shipping notification email sent');
  } catch (error) {
    console.log('Error sending shipping notification email:', error);
  }
};

// Send Delivery Confirmation Email
export const sendDeliveryConfirmation = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('userId');
    const user = await User.findById(order.userId);
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Delivery Confirmation',
      text: `Your order #${orderId} has been delivered!`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Delivery confirmation email sent');
  } catch (error) {
    console.log('Error sending delivery confirmation email:', error);
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${process.env.WEB_SITE_URL}/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent');
  } catch (error) {
    console.log('Error sending password reset email:', error);
  }
};

// Send Newsletter Subscription Email
export const sendNewsletterSubscriptionEmail = async (userEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Newsletter Subscription',
      text: 'Thank you for subscribing to our newsletter!',
    };

    await transporter.sendMail(mailOptions);
    console.log('Newsletter subscription email sent');
  } catch (error) {
    console.log('Error sending newsletter subscription email:', error);
  }
};

// Send Special Promotions Email
export const sendSpecialPromotionEmail = async (userEmail, promotionDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Special Promotion Just for You!',
      text: promotionDetails,
    };

    await transporter.sendMail(mailOptions);
    console.log('Special promotion email sent');
  } catch (error) {
    console.log('Error sending special promotion email:', error);
  }
};

// Send New Order Notification to Admin
export const sendNewOrderNotification = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Order Received',
      text: `A new order #${orderId} has been placed.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('New order notification sent to admin');
  } catch (error) {
    console.log('Error sending new order notification:', error);
  }
};

// Send Low Stock Alert to Admin
export const sendLowStockAlert = async (productName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Low Stock Alert',
      text: `Warning: The stock for ${productName} is running low.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Low stock alert sent to admin');
  } catch (error) {
    console.log('Error sending low stock alert:', error);
  }
};

// Send Contact Form Submission to Admin
export const sendContactFormSubmission = async (name, email, message) => {
  try {
    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact form submission sent to admin');
  } catch (error) {
    console.log('Error sending contact form submission:', error);
  }
};
