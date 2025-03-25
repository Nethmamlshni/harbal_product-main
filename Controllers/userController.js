import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


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
    
        res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };

    
// Forgot password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const existUser = await User.findOne({ email });
        if (!existUser){
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const token = jwt.sign({id: existUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
        try{
        await sendEmail(email, 'forgetPassword', token);
        res.status(200).json({
            message: 'Email sent'
        });

        }catch(error){
            res.status(500).json({
                message: error.message
            });
        }
    }catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    let decodedToken;

    try {
        decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decodedToken.id });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }else {
            // update the password of the user 
            const hashedPassword = await bcrypt.hash(password,10);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({
                message: 'Password updated successfully'
            });
        }
    }catch(error){
        return res.status(400).json({
            message : 'invalid token',
            error : error
        })
    }
};

// View profile
export const getProfile = async (req, res) => {
    try {
        const user = req.user;  
        res.status(200).json(user); 
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    };

// Edit profile details
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Profile (Using req.user.id)
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
