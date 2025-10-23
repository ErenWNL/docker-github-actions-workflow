const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');

describe('Task API Tests', () => {
  
  // Test health check endpoint
  describe('GET /health', () => {
    it('should return status OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'OK');
    });
  });

  // Test GET all tasks
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // Test POST create task
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Test Task');
    });

    it('should fail without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});

// Close database connection after tests
afterAll(async () => {
  await mongoose.connection.close();
});