// prisma/seed-orders.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedOrders() {
  try {
    // Pegar um usuário e um produto existente
    const user = await prisma.user.findFirst();
    const product = await prisma.product.findFirst();

    if (!user || !product) {
      console.log('Necessário ter usuário e produto cadastrados');
      return;
    }

    // Array com diferentes status para criar pedidos variados
    const orderStatuses = [
      'PENDING',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED'
    ];

    // Criar pedidos com diferentes status
    for (const status of orderStatuses) {
      await prisma.order.create({
        data: {
          userId: user.id,
          status: status,
          totalAmount: 100 + Math.random() * 900, // Valor aleatório entre 100 e 1000
          items: {
            create: [
              {
                productId: product.id,
                quantity: Math.floor(Math.random() * 5) + 1, // Quantidade aleatória entre 1 e 5
                price: product.price
              }
            ]
          },
          payment: {
            create: {
              method: 'CREDIT_CARD',
              status: status === 'DELIVERED' ? 'COMPLETED' : 'PENDING',
              amount: 100 + Math.random() * 900,
              currency: 'EUR'
            }
          },
          shipping: {
            create: {
              method: 'CTT_NORMAL',
              address: 'Rua de Teste, 123',
              city: 'Lisboa',
              district: 'Lisboa',
              postalCode: '1000-001',
              country: 'Portugal',
              status: status === 'DELIVERED' ? 'DELIVERED' : 'PENDING',
              cost: 25.00
            }
          }
        }
      });
    }

    console.log('Pedidos de teste criados com sucesso!');
  } catch (error) {
    console.error('Erro ao criar pedidos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedOrders();