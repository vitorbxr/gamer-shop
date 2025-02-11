// backend/src/tests/auth.test.js
import request from 'supertest';
import app from '../server.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Auth API', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should not allow duplicate emails', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: hashedPassword
        }
      });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'test123'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong'
        })
        .expect(401);
    });
  });
});