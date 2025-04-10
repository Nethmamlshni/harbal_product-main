import request from 'supertest';
import app from '../index.js';

describe('User Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/user/register').send({
      firstname: 'John',
      lastname: 'Doe',
      email: 'D4Lk7@example.com', // Unique email for testing     
      password: 'password',
      role: 'user'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });
});

