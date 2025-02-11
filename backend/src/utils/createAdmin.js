// backend/src/utils/createAdmin.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'ADMIN'
      }
    });

    console.log('Usuário admin criado com sucesso:', admin);
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();