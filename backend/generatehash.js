import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdmin() {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = await prisma.user.create({
            data: {
                name: 'Admin',
                email: 'admin@test.com',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log('Admin criado com sucesso:', user);
    } catch (error) {
        console.error('Erro ao criar admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();