import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../Models/User.js';
import Product from '../Models/Product.js';
import Address from '../Models/Address.js';
import Cart from '../Models/Card.js';
import Order from '../Models/Oder.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterEach(async () => {
  await User.deleteMany(); 
});

afterAll(async () => {
  await mongoose.connection.close(); 
});

describe('User Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/user/register').send({
      firstname: 'Johnn',
      lastname: 'Doee',
      email: 'D4Lk77@example.com',
      password: 'password23',
      role: 'user'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });
});

//need to login
describe('User Login', () => {
  it('should login an existing user', async () => {
    const user = new User({
      firstname: 'Johnn',
      lastname: 'Doee',
      email: 'D4Lk77@example.com',
      password: 'password23',
      role: 'user'
    });
    await user.save();

    const res = await request(app).post('/api/user/login').send({
      email: 'D4Lk77@example.com',
      password: 'password23'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });
});

// foget password 
describe('Forgot Password', () => {
  it('should send a password reset email to the user', async () => {
    jest.setTimeout(10000);
    const user = new User({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'user',
    });
    await user.save();

    const res = await request(app)
      .post('/api/user/forgot-password')
      .send({ email: 'john.doe@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password reset email sent successfully');
  });
});
// reset password
describe('Reset Password', () => {
  it('should reset the user password', async () => {
    const user = new User({
      firstname: 'Johnn',
      lastname: 'Doee',
      email: 'D4Lk77@example.com',
      password: 'password23',
      role: 'user'    });
    await user.save();

    const token = await request(app).post('/api/user/login').send({
      email: 'D4Lk77@example.com',
      password: 'password23'
    });
    const res = await request(app).post('/api/user/reset-password').send({
      token: token.body.token,
      newPassword: 'newpassword'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password reset successful. You can now log in with your new password.');

  });
});

//get profile
describe('Get User Profile', () => {
  it('should get the profile of the logged-in user', async () => {
    const user = new User({
      firstname: 'Johnn',
      lastname: 'Doee',
      email: 'D4Lk77@example.com',
      password: 'password23',
      role: 'user'
    });
    await user.save();

    const token = await request(app).post('/api/user/login').send({
      email: 'D4Lk77@example.com',
      password: 'password23'
    });
    const res = await request(app).get('/api/user/profile').set('Authorization', `Bearer ${token.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile retrieved successfully');
  });
});

//update profile details
describe('Update User Profile', () => {
  it('should update the profile details of the logged-in user', async () => {
    const user = new User({
      firstname: 'Johnn',
      lastname: 'Doee',
      email: 'D4Lk77@example.com',
      password: 'password23',
      role: 'user'
    });
    await user.save();

    const token = await request(app).post('/api/user/login').send({
      email: 'D4Lk77@example.com',
      password: 'password23'
    });

    const res = await request(app).put('/api/user/profile').set('Authorization', `Bearer ${token.body.token}`).send({
      firstname: 'Jane',
      lastname: 'Doe',
      email: '9tR2k@example.com',
      profile_image: 'https://example.com/profile.jpg'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile updated successfully'); // The message field is now included
  });
});

//delete profile
describe('Delete User Profile', () => {
  it('should delete the profile of the logged-in user', async () => {
    const user = new User({
      firstname: 'Johnn',
      lastname: 'Doee',
      email: 'D4Lk77@example.com',
      password: 'password23',
      role: 'user'
    });
    await user.save();

    const token = await request(app).post('/api/user/login').send({
      email: 'D4Lk77@example.com',
      password: 'password23'
    });

    const res = await request(app).delete('/api/user/delete').set('Authorization', `Bearer ${token.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile deleted successfully');
  });
});

let productId;

describe('Product API Endpoints', () => {

  it('should add a new product', async () => {
    const res = await request(app).post('/api/product/products').send({
      name: "Test Herbal Oil",
      description: "Great for hair",
      category: "Hair Care",
      state: "oil",
      price: 200,
      stock: 50,
      tags: ["hair", "herbal"],
      ingredients: "Coconut oil, Aloe Vera",
      benefits: "Hair growth",
      usageInstructions: "Apply to scalp daily",
      shelfLife: "2 years",
      weight: "100ml",
      organicCertification: true,
      origin: "Sri Lanka"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Product added successfully");
    expect(res.body.product).toHaveProperty("_id");

    productId = res.body.product._id;
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/product/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a product by ID', async () => {
    const res = await request(app).get(`/api/product/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', productId);
  });

  it('should update a product', async () => {
    const res = await request(app).put(`/api/product/products/${productId}`).send({
      name: "Updated Herbal Oil",
      description: "Improved for hair growth",
      category: "Hair Care",
      state: "oil",
      price: 250,
      discount: 10,
      stock: 40,
      tags: ["hair", "natural"],
      ingredients: "Coconut, Aloe, Curry Leaves",
      benefits: "Fast hair growth",
      usageInstructions: "Apply twice daily",
      shelfLife: "1 year",
      weight: "120ml",
      organicCertification: true,
      origin: "Sri Lanka"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product updated successfully");
    expect(res.body.product.name).toBe("Updated Herbal Oil");
  });

  it('should delete a product', async () => {
    const res = await request(app).delete(`/api/product/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product deleted successfully");
  });

});