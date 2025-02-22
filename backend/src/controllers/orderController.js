// backend/src/controllers/orderController.js
import { PrismaClient } from '@prisma/client';
import { logService } from '../services/logService.js';
import EmailService from '../services/emailService.js';

const prisma = new PrismaClient();

const generateMultibancoRef = () => {
  return {
    entity: '12345',
    reference: Math.random().toString().slice(2, 11)
  };
};

export const orderController = {
  create: async (req, res) => {
    const { items, shipping, payment, couponId, discountAmount } = req.body;
    const userId = req.user.userId;

    try {
      console.log('Recebendo requisição de criação de pedido:', req.body);
      console.log('Usuário:', req.user);

      const order = await prisma.$transaction(async (tx) => {
        // 1. Cria o pedido
        const newOrder = await tx.order.create({
          data: {
            userId,
            status: 'PENDING',
            totalAmount: payment.amount,
            couponId: couponId || null,
            discountAmount: discountAmount || null
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

        // Buscar o pedido completo com todas as relações
        const completeOrder = await tx.order.findUnique({
          where: { id: newOrder.id },
          include: {
            items: {
              include: {
                product: true
              }
            },
            shipping: true,
            payment: true,
            user: true
          }
        });

        return completeOrder;
      });

      // Enviar email de confirmação do pedido
      try {
        await EmailService.sendOrderConfirmation(order, order.user);
      } catch (emailError) {
        logService.error('Erro ao enviar email de confirmação', emailError);
      }

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
                  image: true,
                  price: true
                }
              }
            }
          },
          shipping: true,
          payment: true,
          coupon: true
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

  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.userId;

      // Primeiro, buscar todas as reviews do usuário
      const userReviews = await prisma.review.findMany({
        where: {
          userId: userId
        },
        select: {
          productId: true,
          orderId: true
        }
      });

      // Criar um Set para verificação rápida
      const reviewedProducts = new Set(
        userReviews.map(review => `${review.orderId}-${review.productId}`)
      );

      // Buscar os pedidos
      const orders = await prisma.order.findMany({
        where: {
          userId: userId
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  price: true
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

      // Adicionar informação de reviewed aos itens
      const ordersWithReviewInfo = orders.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          reviewed: reviewedProducts.has(`${order.id}-${item.product.id}`)
        }))
      }));

      res.json(ordersWithReviewInfo);
    } catch (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
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
                  id: true,
                  name: true,
                  image: true,
                  price: true
                }
              }
            }
          },
          shipping: true,
          payment: true,
          coupon: true
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
        data: { status },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          },
          shipping: true
        }
      });

      // Envia email de atualização de status
      try {
        await EmailService.sendOrderStatusUpdate(order, order.user);
      } catch (emailError) {
        logService.error('Erro ao enviar email de atualização de status', emailError);
      }

      logService.info('Status do pedido atualizado', { orderId: order.id, status });
      res.json(order);
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      logService.error('Erro ao atualizar status do pedido', error);
      res.status(500).json({ message: 'Erro ao atualizar status do pedido' });
    }
  },

  updateTrackingNumber: async (req, res) => {
    const { id } = req.params;
    const { trackingNumber } = req.body;
  
    try {
      console.log('Atualizando rastreio e status:', { id, trackingNumber });
  
      // Atualiza em uma única operação
      const order = await prisma.order.update({
        where: { id: parseInt(id) },
        data: {
          status: 'SHIPPED',  // Atualiza o status do pedido para 'SHIPPED'
          shipping: {
            update: {
              trackingCode: trackingNumber,
              status: 'SHIPPED'  // Atualiza o status do shipping também
            }
          }
        },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          },
          shipping: true
        }
      });
  
      // Envia email de atualização para o cliente com o código de rastreio
      try {
        await EmailService.sendOrderStatusUpdate(order, order.user);
        console.log('Email de atualização enviado');
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        logService.error('Erro ao enviar email de atualização', emailError);
      }
  
      logService.info('Código de rastreio adicionado e status atualizado', {
        orderId: order.id,
        trackingNumber,
        status: 'SHIPPED'
      });
  
      res.json(order);
    } catch (error) {
      console.error('Erro ao atualizar rastreio:', error);
      logService.error('Erro ao atualizar rastreio e status', error);
      res.status(500).json({
        message: 'Erro ao atualizar pedido',
        error: error.message
      });
    }
  },

  // Método atualizado baseado no updateStatus
  updateOrder: async (req, res) => {
    const { id } = req.params;
    const { shipping } = req.body;
  
    try {
      console.log('Iniciando atualização do pedido:', { id, shipping });
      
      const order = await prisma.order.update({
        where: { id: parseInt(id) },
        data: {
          shipping: {
            update: {
              address: shipping.address,
              city: shipping.city,
              postalCode: shipping.postalCode,
              trackingCode: shipping.trackingCode
            }
          }
        },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          },
          shipping: true,
          payment: true
        }
      });
  
      console.log('Pedido atualizado com sucesso:', { 
        orderId: order.id, 
        user: order.user.email,
        shipping: order.shipping
      });
  
      // Usa a função existente de atualização de status, mas com um status especial
      try {
        console.log('Tentando enviar email...');
        // Cria uma cópia do pedido com um status especial para notificação de atualização de dados
        const tempOrder = { ...order, status: "DADOS_ATUALIZADOS" };
        await EmailService.sendOrderStatusUpdate(tempOrder, order.user);
        console.log('Email enviado com sucesso!');
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        logService.error('Erro ao enviar email de atualização', emailError);
      }
  
      logService.info('Pedido atualizado com sucesso', { orderId: order.id });
      res.json(order);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      logService.error('Erro ao atualizar pedido', error);
      res.status(500).json({ message: 'Erro ao atualizar pedido' });
    }
  },

  deleteOrder: async (req, res) => {
    const { id } = req.params;

    try {
      // Verificar se o pedido existe
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          items: true,
          shipping: true,
          payment: true
        }
      });

      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      // Executar a exclusão em uma transação
      await prisma.$transaction(async (tx) => {
        // 1. Restaurar o estoque dos produtos
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });
        }

        // 2. Deletar registros relacionados
        await tx.orderItem.deleteMany({
          where: { orderId: order.id }
        });

        await tx.payment.deleteMany({
          where: { orderId: order.id }
        });

        await tx.shipping.deleteMany({
          where: { orderId: order.id }
        });

        await tx.review.deleteMany({
          where: { orderId: order.id }
        });

        // 3. Finalmente deletar o pedido
        await tx.order.delete({
          where: { id: order.id }
        });
      });

      logService.info('Pedido excluído com sucesso', { 
        orderId: order.id
      });

      res.json({ 
        message: 'Pedido excluído com sucesso',
        orderId: order.id
      });

    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      logService.error('Erro ao excluir pedido', error);
      res.status(500).json({ 
        message: 'Erro ao excluir pedido',
        error: error.message 
      });
    }
  }
};