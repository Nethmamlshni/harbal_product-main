import jwt from 'jsonwebtoken';
import User from '../Models/User.js'; 

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach the user to the request object
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message); // Debugging
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); 
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  };
