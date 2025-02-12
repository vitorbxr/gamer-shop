// Você pode criar um arquivo seed-orders.js na pasta prisma
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
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
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
              method: 'credit',
              status: status === 'delivered' ? 'paid' : 'pending',
              amount: 100 + Math.random() * 900
            }
          },
          shipping: {
            create: {
              address: 'Rua de Teste, 123',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01234-567',
              status: status,
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