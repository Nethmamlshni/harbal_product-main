import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import './config/passportConfig.js';
import Userrouter from './Routes/userRoutes.js';
import Productrouter from './Routes/productRoutes.js';
import OrderRouter from './Routes/oderRoutes.js';
import CartRouter from './Routes/cardRoutes.js';
import emailRouter from './Routes/emailRoutes.js';
import BlogRouter from './Routes/blogRoutes.js';
import adminRouter from './Routes/adminRoutes.js';
import AddressRouter from './Routes/addressRoutes.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.get('/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }),
    (req, res) => {
      res.redirect('/');
    }
  );

  // Login route
app.get('/login', (req, res) => {
    res.send('Login page');
  });
  
  // Logout route
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  

app.use('/api/user', Userrouter);
app.use('/api/product', Productrouter);
app.use('/api/order', OrderRouter);
app.use('/api/card', CartRouter);
app.use('/api/email', emailRouter);
app.use('/api/blog', BlogRouter);
app.use('/api/admin', adminRouter);
app.use('/api/address', AddressRouter);


// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send({ message: 'Something went wrong!' });
  });

const connectDB = process.env.MONGO_URL;

mongoose.connect(connectDB).then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); 
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

