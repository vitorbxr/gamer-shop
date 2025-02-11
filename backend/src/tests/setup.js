// backend/src/tests/setup.js
import { PrismaClient } from '@prisma/client';
import { logService } from '../services/logService.js';

const prisma = new PrismaClient();

// Desabilita logs durante os testes
jest.mock('../services/logService.js', () => ({
  logService: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Limpa o banco de dados antes de cada teste
beforeEach(async () => {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
});

// Fecha a conexão com o banco após os testes
afterAll(async () => {
  await prisma.$disconnect();
});