// backend/src/tests/helpers.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const testHelpers = {
  createTestUser: async (role = 'USER') => {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: hashedPassword,
        role
      }
    });
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    return { user, token };
  },

  createTestCategory: () => {
    return prisma.category.create({
      data: {
        name: `Test Category ${Date.now()}`
      }
    });
  },

  createTestBrand: () => {
    return prisma.brand.create({
      data: {
        name: `Test Brand ${Date.now()}`
      }
    });
  },

  createTestProduct: async (categoryId, brandId) => {
    return prisma.product.create({
      data: {
        name: `Test Product ${Date.now()}`,
        price: 99.99,
        description: 'Test description',
        stock: 10,
        categoryId,
        brandId,
        isActive: true
      }
    });
  }
};