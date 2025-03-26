import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

app.use('/api/user', Userrouter);
app.use('/api/product', Productrouter);
app.use('/api/order', OrderRouter);
app.use('/api/card', CartRouter);
app.use('/api/email', emailRouter);
app.use('/api/blog', BlogRouter);
app.use('/api/admin', adminRouter);
app.use('/api/address', AddressRouter);

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

