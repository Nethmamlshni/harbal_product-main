import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';



// Register a new user
export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        const user = new User({
          firstname,
          lastname,
          email,
          password,
          role
        });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
    
        res.status(201).json({ message: 'User registered successfully', token });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role },process.env.JWT_SECRET , { expiresIn: '1h' });
    
        res.status(200).json({ message: 'Login successful', 
          user : { _id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role }, token });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };
  
// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const link = `${process.env.WEB_SITE_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'nethmamalshani2002@gmail.com', 
      pass: 'sqdg zebo wbno bgdc',
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${link}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error sending email' });
    }

    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Password reset email sent successfully' });
  });
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
          return res.status(400).json({ message: "Token and new password are required." });
      }
      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
          if (error.name === "TokenExpiredError") {
              return res.status(401).json({ message: "Token has expired. Please request a new one." });
          }
          return res.status(400).json({ message: "Invalid token." });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      if (newPassword.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters long." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
  } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

// View profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('firstname lastname email profile_image');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Profile retrieved successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit profile details
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, select: 'firstname lastname email profile_image' }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete Profile 
export const deleteProfile = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
