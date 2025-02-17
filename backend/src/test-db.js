// backend/src/test-db.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Tenta fazer uma query simples
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Conexão com o banco de dados OK:', result);
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();