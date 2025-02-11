import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar categorias
  await prisma.category.createMany({
    data: [
      { name: 'Processadores' },
      { name: 'Placas de Vídeo' },
      { name: 'Memória RAM' }
    ]
  });

  // Criar marcas
  await prisma.brand.createMany({
    data: [
      { name: 'Intel' },
      { name: 'AMD' },
      { name: 'NVIDIA' },
      { name: 'Corsair' }
    ]
  });

  // Criar usuário admin
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@gamershop.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    }
  });
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })