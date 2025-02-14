import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Primeiro, vamos deletar o usuário admin existente se houver
    await prisma.user.deleteMany({
      where: {
        email: 'admin@test.com'
      }
    });

    // Criar senha hash
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Senha hash gerada:', hashedPassword);

    // Criar novo usuário admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      }
    });

    console.log('Usuário admin criado com sucesso:', admin);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();