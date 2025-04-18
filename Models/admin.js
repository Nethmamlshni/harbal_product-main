import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
    token : { type: String, default: null },
    confirmed: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;