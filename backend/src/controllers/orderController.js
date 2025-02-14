// backend/src/controllers/orderController.js
import { PrismaClient } from '@prisma/client';
import { logService } from '../services/logService.js';

const prisma = new PrismaClient();

const generateMultibancoRef = () => {
  return {
    entity: '12345',
    reference: Math.random().toString().slice(2, 11)
  };
};

export const orderController = {
  create: async (req, res) => {
    const { items, shipping, payment } = req.body;
    const userId = req.user.userId; // Vem do middleware de autenticação

    try {
      // Inicia a transação
      const order = await prisma.$transaction(async (tx) => {
        // 1. Cria o pedido
        const newOrder = await tx.order.create({
          data: {
            userId,
            status: 'PENDING',
            totalAmount: payment.amount,
          }
        });

        // 2. Cria os itens do pedido
        await tx.orderItem.createMany({
          data: items.map(item => ({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        });

        // 3. Cria o registro de envio
        await tx.shipping.create({
          data: {
            orderId: newOrder.id,
            method: shipping.shippingMethod,
            status: 'PENDING',
            address: shipping.street,
            city: shipping.city,
            district: shipping.district,
            postalCode: shipping.postalCode,
            country: 'Portugal',
            cost: shipping.cost
          }
        });

        // 4. Cria o registro de pagamento
        let paymentData = {
          orderId: newOrder.id,
          method: payment.method,
          status: 'PENDING',
          amount: payment.amount,
          currency: payment.currency
        };

        // Adiciona campos específicos baseado no método de pagamento
        if (payment.method === 'CREDIT_CARD') {
          paymentData.lastDigits = payment.cardNumber.slice(-4);
        } else if (payment.method === 'MULTIBANCO') {
          const { entity, reference } = generateMultibancoRef();
          paymentData.entity = entity;
          paymentData.reference = reference;
        }

        await tx.payment.create({
          data: paymentData
        });

        // 5. Atualiza o estoque dos produtos
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }

        return newOrder;
      });

      // Se o pagamento for Multibanco, retorna os dados de referência
      const response = {
        orderId: order.id,
        status: order.status
      };

      if (payment.method === 'MULTIBANCO') {
        const { entity, reference } = generateMultibancoRef();
        response.entity = entity;
        response.reference = reference;
      }

      logService.info('Pedido criado com sucesso', { orderId: order.id });
      res.status(201).json(response);

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      logService.error('Erro ao criar pedido', error);
      res.status(500).json({ message: 'Erro ao criar pedido' });
    }
  },

  getAll: async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  image: true
                }
              }
            }
          },
          shipping: true,
          payment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(orders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      logService.error('Erro ao buscar pedidos', error);
      res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  image: true
                }
              }
            }
          },
          shipping: true,
          payment: true
        }
      });

      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      res.json(order);
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      logService.error('Erro ao buscar pedido', error);
      res.status(500).json({ message: 'Erro ao buscar pedido' });
    }
  },

  updateStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const order = await prisma.order.update({
        where: { id: parseInt(id) },
        data: { status }
      });

      logService.info('Status do pedido atualizado', { orderId: order.id, status });
      res.json(order);
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      logService.error('Erro ao atualizar status do pedido', error);
      res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
    }
  }
};