import jwt from 'jsonwebtoken';
import User from '../Models/User.js'; 

export const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(verified.id); 
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token", error });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); 
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  };
