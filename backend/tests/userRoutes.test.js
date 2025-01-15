const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
require('dotenv').config();

const validUserId = '67880b05ada218caccc013bc'; // Replace with an actual user ID from your database
const invalidUserId = '64b15c18d1223e4a89e23412'; // Valid ObjectId format, but non-existent in DB

describe('User GET Routes', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URI;
    console.log(`Connecting to MongoDB at ${uri}`);
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /api/users/:userId/watchlist', () => {
    it('should return the user\'s watchlist', async () => {
      const res = await request(app).get(`/api/users/${validUserId}/watchlist`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 404 if user does not exist', async () => {
      const res = await request(app).get(`/api/users/${invalidUserId}/watchlist`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
      const res = await request(app).get(`/api/users/invalid-format/watchlist`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid user ID format');
    });
  });

  describe('GET /api/users/:userId/history', () => {
    it('should return the user\'s watch history', async () => {
      const res = await request(app).get(`/api/users/${validUserId}/history`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 404 if user does not exist', async () => {
      const res = await request(app).get(`/api/users/${invalidUserId}/history`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
      const res = await request(app).get(`/api/users/invalid-format/history`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid user ID format');
    });
  });
});
