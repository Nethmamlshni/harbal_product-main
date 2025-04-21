import Product from '../Models/Product.js';
import Order from '../Models/Oder.js';
import Blog from '../Models/Blog.js';
import Admin from '../Models/admin.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../Models/User.js';
import dotenv from 'dotenv';
dotenv.config();

//Admin Invitation Link
export const adminLink = async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

  await Admin.create({ email,token, expiresAt });

  const link = `${process.env.WEB_SITE_URL}/register-admin?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: process.env.SERVER,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Admin Invitation",
    html: `Click <a href="${link}">here</a> to register as an admin.`,
  });

  res.json({ message: "Admin invitation sent!" });
};

//Admin Register
export const adminRegister = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    // Find the token document in the Admin model
    const tokenDoc = await Admin.findOne({ token });

    if (!tokenDoc || tokenDoc.expiresAt < Date.now() || tokenDoc.email !== email) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    await User.create({
      firstname: "Admin", // Default firstname
      lastname: "Admin", // Default lastname
      email,
      password: hashedPassword,
      role: "admin",
    });

    // Delete the token document from the Admin model
    await Admin.deleteOne({ _id: tokenDoc._id });

    res.status(201).json({ message: "Admin successfully registered!" });
  } catch (error) {
    console.error("Error registering admin:", error.message);
    res.status(400).json({ message: error.message });
  }
};
// Get system analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalBlogPosts = await Blog.countDocuments();

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
export const viewAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// View all orders
export const viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
