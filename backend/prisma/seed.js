// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin se não existir
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    }
  });

  // Criar alguns produtos se não existirem
  const mouse = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Mouse Gamer',
      description: 'Mouse gamer profissional',
      price: 299.99,
      stock: 10,
      isActive: true
    }
  });

  const keyboard = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Teclado Mecânico',
      description: 'Teclado mecânico RGB',
      price: 499.99,
      stock: 5,
      isActive: true
    }
  });

  // Criar pedidos de teste
  await prisma.order.create({
    data: {
      userId: adminUser.id,
      status: 'delivered',
      totalAmount: 299.99,
      items: {
        create: [
          {
            productId: mouse.id,
            quantity: 1,
            price: 299.99
          }
        ]
      },
      payment: {
        create: {
          method: 'credit',
          status: 'paid',
          amount: 299.99,
          installments: 3
        }
      },
      shipping: {
        create: {
          address: 'Rua Exemplo, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          status: 'delivered',
          cost: 25.00
        }
      }
    }
  });

  await prisma.order.create({
    data: {
      userId: adminUser.id,
      status: 'pending',
      totalAmount: 499.99,
      items: {
        create: [
          {
            productId: keyboard.id,
            quantity: 1,
            price: 499.99
          }
        ]
      },
      payment: {
        create: {
          method: 'pix',
          status: 'pending',
          amount: 499.99
        }
      },
      shipping: {
        create: {
          address: 'Av Principal, 456',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '20000-000',
          status: 'pending',
          cost: 35.00
        }
      }
    }
  });

  console.log('Dados de teste criados com sucesso');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });