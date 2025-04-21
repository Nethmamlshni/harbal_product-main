import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
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

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } ,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ================== AUTH ROUTES ================== //

// Google Auth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Facebook Auth
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Login Page
app.get('/login', (req, res) => {
  res.send('Login page');
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// ================== API ROUTES ================== //
app.use('/api/user', Userrouter);
app.use('/api/product', Productrouter);
app.use('/api/order', OrderRouter);
app.use('/api/card', CartRouter);
app.use('/api/email', emailRouter);
app.use('/api/blog', BlogRouter);
app.use('/api/admin', adminRouter);
app.use('/api/address', AddressRouter);

// ================== ERROR HANDLING ================== //
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send({ message: 'Something went wrong!' });
});

// ================== DATABASE CONNECT ================== //
const connectDB = process.env.MONGO_URL;

mongoose.connect(connectDB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.log('DB Connection Error:', err);
  });

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;