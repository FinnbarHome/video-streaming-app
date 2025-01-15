const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Your Express app
const User = require('../models/User'); // User model

require('dotenv').config();

let validUserId;

describe('User GET Routes', () => {
  beforeAll(async () => {
    // Connect to the test database
    const uri = process.env.MONGO_URI;
    console.log(`Connecting to MongoDB at ${uri}`);
    await mongoose.connect(uri);

    // Retrieve an existing user ID from the database
    const existingUser = await User.findOne();
    if (existingUser) {
      validUserId = existingUser._id.toString(); // Convert ObjectId to string
    } else {
      throw new Error('No users found in the database. Add a user to proceed.');
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /api/users/:userId/watchlist', () => {
    it("should return the user's watchlist", async () => {
      const res = await request(app).get(`/api/users/${validUserId}/watchlist`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true); // Expecting an array of videos
    });

    it('should return 404 if user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(
        `/api/users/${nonExistentId}/watchlist`
      );

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
      const res = await request(app).get('/api/users/invalid-format/watchlist');

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid user ID format');
    });
  });

  describe('GET /api/users/:userId/history', () => {
    it("should return the user's watch history", async () => {
      const res = await request(app).get(`/api/users/${validUserId}/history`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true); // Expecting an array of videos
    });

    it('should return 404 if user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/users/${nonExistentId}/history`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
      const res = await request(app).get('/api/users/invalid-format/history');

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid user ID format');
    });
  });
});
