import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../Models/User.js';
import Product from '../Models/Product.js';
import Address from '../Models/Address.js';
import Cart from '../Models/Card.js';
import Order from '../Models/Oder.js';
import Blog from '../Models/Blog.js';
import Comment from '../Models/comment.js';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');


let productId = '';
let adminToken = '';
let userToken = '';
let blogId = '';
let addressId = '';
let orderId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register and log in an admin user
  await request(app).post('/api/user/register').send({
    firstname: 'Admin',
    lastname: 'User',
    email: 'admin@example.com',
    password: 'adminpassword',
    role: 'admin',
  });

  const adminLoginRes = await request(app).post('/api/user/login').send({
    email: 'admin@example.com',
    password: 'adminpassword',
  });

  adminToken = adminLoginRes.body.token;
  console.log('Admin Token:', adminToken);

  // Register and log in a regular user
  await request(app).post('/api/user/register').send({
    firstname: 'Regular',
    lastname: 'User',
    email: 'user@example.com',
    password: 'userpassword',
    role: 'user',
  });

  const userLoginRes = await request(app).post('/api/user/login').send({
    email: 'user@example.com',
    password: 'userpassword',
  });

  userToken = userLoginRes.body.token;
  console.log('User Token:', userToken);
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
});

// ---------------------- User Tests ----------------------

describe('User Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/user/register').send({
      firstname: 'John',
      lastname: 'Doe',
      email: 'testuser@example.com',
      password: 'password23',
      role: 'user'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should login an existing user', async () => {
    const user = new User({
      firstname: 'John',
      lastname: 'Doe',
      email: 'loginuser@example.com',
      password: 'password23',
      role: 'user'
    });
    await user.save();

    const res = await request(app).post('/api/user/login').send({
      email: 'loginuser@example.com',
      password: 'password23'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });

  /*it('should send a password reset email', async () => {
    const user = new User({
      firstname: 'John',
      lastname: 'Doe',
      email: 'reset@example.com',
      password: 'password123',
      role: 'user',
    }, 500000);
    await user.save();

    const res = await request(app).post('/api/user/forgot-password').send({
      email: 'reset@example.com'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password reset email sent successfully');
  });

  it('should reset the password', async () => {
    const user = new User({
      firstname: 'Reset',
      lastname: 'Test',
      email: 'reset2@example.com',
      password: 'oldpass',
      role: 'user',
    });
    await user.save();

    const login = await request(app).post('/api/user/login').send({
      email: 'reset2@example.com',
      password: 'oldpass'
    });

    const res = await request(app).post('/api/user/reset-password').send({
      token: login.body.token,
      newPassword: 'newpass123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password reset successful. You can now log in with your new password.');
  });
  */
  it('should get the user profile', async () => {
    const user = new User({
      firstname: 'View',
      lastname: 'User',
      email: 'view@example.com',
      password: 'password',
      role: 'user',
    });
    await user.save();
  
    const login = await request(app).post('/api/user/login').send({
      email: 'view@example.com',
      password: 'password',
    });
  
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${login.body.token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile retrieved successfully');
    expect(res.body.user.email).toBe('view@example.com');
  });

  it('should update the user profile', async () => {
    const user = new User({
      firstname: 'Update',
      lastname: 'Me',
      email: 'update@example.com',
      password: 'password',
      role: 'user',
    });
    await user.save();
  
    const login = await request(app).post('/api/user/login').send({
      email: 'update@example.com',
      password: 'password',
    });
  
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        firstname: 'Updated',
        lastname: 'Name',
        email: 'updated@example.com',
        profile_image: 'https://example.com/image.jpg',
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile updated successfully');
    expect(res.body.user.firstname).toBe('Updated');
  });

  it('should delete the user profile', async () => {
    const user = new User({
      firstname: 'Delete',
      lastname: 'Me',
      email: 'delete@example.com',
      password: 'password',
      role: 'user'
    });
    await user.save();

    const login = await request(app).post('/api/user/login').send({
      email: 'delete@example.com',
      password: 'password'
    });

    const res = await request(app).delete('/api/user/delete')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile deleted successfully');
  });
});

// ---------------------- Product Tests ----------------------

describe('Product API Endpoints', () => {
  beforeEach(async () => {
    const res = await request(app).post('/api/product/products').send({
      name: "Test Oil",
      description: "Good for hair",
      category: "Hair Care",
      state: "oil",
      price: 300,
      stock: 30,
      tags: ["hair", "herbal"],
      ingredients: "Coconut, Aloe",
      benefits: "Hair growth",
      usageInstructions: "Use daily",
      shelfLife: "1 year",
      weight: "100ml",
      organicCertification: true,
      origin: "Sri Lanka"
    });

    productId = res.body.product._id;
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/product/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a specific product', async () => {
    const res = await request(app).get(`/api/product/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Oil");
  });

  it('should update a product', async () => {
    const res = await request(app).put(`/api/product/products/${productId}`).send({
      name: "Updated Oil",
      description: "Better for hair",
      category: "Hair Care",
      state: "oil",
      price: 400,
      stock: 50,
      tags: ["hair", "herbal"],
      ingredients: "Coconut, Aloe",
      benefits: "Hair growth",
      usageInstructions: "Use daily",
      shelfLife: "1 year",
      weight: "100ml",
      organicCertification: true,
      origin: "Sri Lanka"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product updated successfully");
    expect(res.body.product.name).toBe("Updated Oil");
  });

  it('should delete a product', async () => {
    const res = await request(app).delete(`/api/product/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product deleted successfully");
  });

  it('should return 404 for deleted product', async () => {
    await request(app).delete(`/api/product/products/${productId}`);
    const res = await request(app).get(`/api/product/products/${productId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });
});

// ---------------------- address Tests ----------------------

describe('Address API', () => {
  let localToken = '';
  let addressId = '';

  beforeEach(async () => {
    // Register a test user
    await request(app).post('/api/user/register').send({
      firstname: 'Address',
      lastname: 'Tester',
      email: 'addresstest@example.com',
      password: 'password',
      role: 'user'
    });

    // Login to get token
    const login = await request(app).post('/api/user/login').send({
      email: 'addresstest@example.com',
      password: 'password'
    });

    localToken = login.body.token;

    // Add an address for the logged-in user
    const res = await request(app)
      .post('/api/address/addresses')
      .set('Authorization', `Bearer ${localToken}`)
      .send({
        street: '123 Main St',
        city: 'Colombo',
        state: 'Western',
        postalCode: '10100',
        country: 'Sri Lanka',
        type: 'shipping',
      });

    addressId = res.body.address._id; // Store the address ID for future tests
  });

  test('POST /api/addresses - Add address', async () => {
    const res = await request(app)
      .post('/api/address/addresses')
      .set('Authorization', `Bearer ${localToken}`)
      .send({
        street: '123 Main St',
        city: 'Colombo',
        state: 'Western',
        postalCode: '10100',
        country: 'Sri Lanka',
        type: 'shipping',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('address');
    addressId = res.body.address._id;
  });

  test('GET /api/address/addresses - Get all user addresses', async () => {
    const res = await request(app)
      .get('/api/address/addresses')
      .set('Authorization', `Bearer ${localToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.addresses)).toBe(true);
    expect(res.body.addresses.length).toBeGreaterThan(0); // Ensure at least one address exists
  });

  test('PUT /api/address/addresses/:id - Update address', async () => {
    const res = await request(app)
      .put(`/api/address/addresses/${addressId}`)
      .set('Authorization', `Bearer ${localToken}`)
      .send({
        street: '456 Updated St',
        city: 'Kandy',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.address.street).toBe('456 Updated St');
    expect(res.body.address.city).toBe('Kandy');
  });

  test('DELETE /api/address/addresses/:id - Delete address', async () => {
    const res = await request(app)
      .delete(`/api/address/addresses/${addressId}`)
      .set('Authorization', `Bearer ${localToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Address deleted successfully');
  });
});

// ---------------------- Cart Tests ----------------------


describe('Cart Controller Tests', () => {
  beforeEach(async () => {
      const res = await request(app).post('/api/product/products').send({
        name: "Test Oil",
        description: "Good for hair",
        category: "Hair Care",
        state: "oil",
        price: 300,
        stock: 30,
        tags: ["hair", "herbal"],
        ingredients: "Coconut, Aloe",
        benefits: "Hair growth",
        usageInstructions: "Use daily",
        shelfLife: "1 year",
        weight: "100ml",
        organicCertification: true,
        origin: "Sri Lanka"
      });

      productId = res.body.product._id;
      
    });

  it('should add a product to the cart', async () => {
    const res = await request(app)
      .post('/api/card/cards')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        productId,
        quantity: 2,
      });
      
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.totalPrice).toBe(600);
  });

  it('should get the cart details', async () => {
    // Add a product to the cart first
    const addRes = await request(app)
      .post('/api/card/cards')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        productId,
        quantity: 2,
      });
  
    // Now get the cart details
    const res = await request(app)
      .get('/api/card/cart')
      .set('Authorization', `Bearer ${userToken}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBe(2);
    expect(res.body.totalPrice).toBe(1200);
  });

  it('should remove a product from the cart', async () => {
    // Add a product to the cart first
    await request(app)
      .post('/api/card/cards')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        productId,
        quantity: 2,
      });

    const res = await request(app)
      .delete('/api/card/removecard')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        productId,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBe(2);
    expect(res.body.totalPrice).toBe(1200);
  });

  it('should merge guest cart with user cart', async () => {
    // Simulate a guest cart
    const guestCart = {
      items: [
        { productId: 'product1', quantity: 1, price: 300 },
        { productId: 'product2', quantity: 1, price: 300 },
      ],
    };
  
    // Save the guest cart in the session
    await request(app)
      .post('/api/card/mergecard')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ guestCartItems: guestCart.items });
  
    // Fetch the merged cart
    const res = await request(app)
      .get('/api/card/cart')
      .set('Authorization', `Bearer ${userToken}`);
    console.log('Merged Cart Response:', res.body); // Debugging
  
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBe(2); // Expect 2 unique items
    expect(res.body.totalPrice).toBe(1200); // Expect total price to be 1200
  });
});
// ---------------------- order Tests ----------------------

// ---------------------- Blog Tests ----------------------

describe('Blog Routes Tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany(); // Clear all blog posts before each test
  });
  it('should create a new blog post', async () => {
    const res = await request(app)
      .post('/api/blog/blogs/create')
      .set('Authorization', `Bearer ${userToken}`) // Ensure the user is authenticated
      .send({
        title: 'Test Blog',
        content: 'This is a test blog post.',
        tags: ['test', 'blog'],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Blog post created successfully');
    expect(res.body.post).toHaveProperty('_id'); // Ensure the blog has an ID
    blogId = res.body.post._id; // Save the blog ID for later tests
  });

  it('should get all blog posts', async () => {
    const user = new User({
      firstname: 'Author',
      lastname: 'Test',
      email: 'author@example.com',
      password: 'password',
      role: 'user',
    });
    await user.save();
  
    await Blog.create({
      title: 'Test Blog',
      content: 'This is a test blog post.',
      tags: ['test', 'blog'],
      author: user._id, // Reference the valid user ID
    });
  
    const res = await request(app).get('/api/blog/blogs');
  
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it('should get a blog post by ID', async () => {
    const blog = await Blog.create({
      title: 'Test Blog',
      content: 'This is a test blog post.',
      tags: ['test', 'blog'],
      author: new mongoose.Types.ObjectId(),
    });

    const res = await request(app).get(`/api/blog/blogs/${blog._id}`); // Use _id, not id

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Blog');
  });

  it('should update a blog post', async () => {
    const blog = await Blog.create({
      title: 'Old Title',
      content: 'Old content.',
      tags: ['old'],
      author: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .put(`/api/blog/blogs/update/${blog._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Updated Title',
        content: 'Updated content.',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Post updated successfully');
  });
  it('should delete a blog post', async () => {
    const blog = await Blog.create({
      title: 'Test Blog',
      content: 'This is a test blog post.',
      tags: ['test', 'blog'],
      author: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .delete(`/api/blog/blogs/delete/${blog._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Post deleted successfully');
  });

  it('should add a comment to a blog post', async () => {
    const blog = await Blog.create({
      title: 'Test Blog',
      content: 'This is a test blog post.',
      tags: ['test', 'blog'],
      author: new mongoose.Types.ObjectId(),
    });
  
    const res = await request(app)
      .post('/api/blog/blogs/comment')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        postId: blog._id, // Ensure the blog ID is valid
        commentText: 'This is a test comment.', // Provide valid comment text
      });
  
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Comment added successfully');
    expect(res.body.comment).toHaveProperty('_id'); // Ensure the comment has an ID
  });
  it('should search and filter blog posts by title and tags', async () => {
    // Create sample blog posts
    await Blog.create([
      {
        title: 'Test Blog 1',
        content: 'Content for Test Blog 1',
        tags: ['test', 'blog'],
        author: new mongoose.Types.ObjectId(),
      },
      {
        title: 'Another Blog',
        content: 'Content for Another Blog',
        tags: ['example', 'blog'],
        author: new mongoose.Types.ObjectId(),
      },
      {
        title: 'Test Blog 2',
        content: 'Content for Test Blog 2',
        tags: ['test', 'example'],
        author: new mongoose.Types.ObjectId(),
      },
    ]);
  
    // Search by title
    let res = await request(app).get('/api/blog/blogs/search').query({ title: 'Test' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2); // Should return 2 blogs with "Test" in the title
    expect(res.body[0].title).toMatch(/Test/i);
  
    // Filter by tags
    res = await request(app).get('/api/blog/blogs/search').query({ tags: 'example' });
   
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2); // Should return 2 blogs with the "example" tag
    expect(res.body[0].tags).toContain('example');
  
    // Search by title and filter by tags
    res = await request(app).get('/api/blog/blogs/search').query({ title: 'Test', tags: 'test' });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2); // Should return 2 blogs matching both criteria
    expect(res.body[0].title).toMatch(/Test/i);
    expect(res.body[0].tags).toContain('test');
  });
});
  
// ---------------------- admin Tests ----------------------

// ---------------------- email Tests ----------------------