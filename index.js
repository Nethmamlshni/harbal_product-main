import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Userrouter from './Routes/userRoutes.js';


dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/user', Userrouter);

const connectDB = process.env.MONGO_URL;

mongoose.connect(connectDB).then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); 
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
