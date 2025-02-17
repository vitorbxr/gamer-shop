// backend/src/controllers/reviewController.js
import { prisma } from '../lib/prisma.js';

export const reviewController = {
  // Criar nova avaliação
  create: async (req, res) => {
    try {
      const { productId, orderId, rating, comment, title } = req.body;
      const userId = req.user.userId;

      // Verifica se o usuário pode avaliar este produto
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
          status: 'DELIVERED',
          items: {
            some: {
              productId: parseInt(productId)
            }
          }
        }
      });

      if (!order) {
        return res.status(403).json({ 
          message: 'Você só pode avaliar produtos de pedidos entregues' 
        });
      }

      // Verifica se já existe uma avaliação
      const existingReview = await prisma.review.findFirst({
        where: {
          userId,
          productId: parseInt(productId),
          orderId
        }
      });

      if (existingReview) {
        return res.status(400).json({ 
          message: 'Você já avaliou este produto neste pedido' 
        });
      }

      // Cria a avaliação
      const review = await prisma.$transaction(async (tx) => {
        // Cria a avaliação
        const newReview = await tx.review.create({
          data: {
            rating,
            comment,
            title,
            userId,
            productId: parseInt(productId),
            orderId,
            isVerified: true
          }
        });

        // Atualiza as estatísticas do produto
        const reviews = await tx.review.findMany({
          where: {
            productId: parseInt(productId),
            isPublic: true
          },
          select: {
            rating: true
          }
        });

        const totalReviews = reviews.length;
        const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews;

        await tx.product.update({
          where: { id: parseInt(productId) },
          data: {
            avgRating,
            totalReviews
          }
        });

        return newReview;
      });

      res.status(201).json(review);
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      res.status(500).json({ message: 'Erro ao criar avaliação' });
    }
  },

  // Listar avaliações de um produto
  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await prisma.review.findMany({
        where: {
          productId: parseInt(productId),
          isPublic: true
        },
        include: {
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(reviews);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      res.status(500).json({ message: 'Erro ao buscar avaliações' });
    }
  },

  // Listar avaliações do usuário
  getUserReviews: async (req, res) => {
    try {
      const userId = req.user.userId;
      const reviews = await prisma.review.findMany({
        where: {
          userId
        },
        include: {
          product: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(reviews);
    } catch (error) {
      console.error('Erro ao buscar avaliações do usuário:', error);
      res.status(500).json({ message: 'Erro ao buscar avaliações' });
    }
  },

  // Atualizar avaliação
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment, title, isPublic } = req.body;
      const userId = req.user.userId;

      const review = await prisma.review.findUnique({
        where: { id: parseInt(id) }
      });

      if (!review) {
        return res.status(404).json({ message: 'Avaliação não encontrada' });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ message: 'Não autorizado' });
      }

      const updatedReview = await prisma.$transaction(async (tx) => {
        // Atualiza a avaliação
        const updated = await tx.review.update({
          where: { id: parseInt(id) },
          data: {
            rating,
            comment,
            title,
            isPublic
          }
        });

        // Atualiza as estatísticas do produto
        const reviews = await tx.review.findMany({
          where: {
            productId: review.productId,
            isPublic: true
          },
          select: {
            rating: true
          }
        });

        const totalReviews = reviews.length;
        const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews;

        await tx.product.update({
          where: { id: review.productId },
          data: {
            avgRating,
            totalReviews
          }
        });

        return updated;
      });

      res.json(updatedReview);
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      res.status(500).json({ message: 'Erro ao atualizar avaliação' });
    }
  },

  // Deletar avaliação
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const review = await prisma.review.findUnique({
        where: { id: parseInt(id) }
      });

      if (!review) {
        return res.status(404).json({ message: 'Avaliação não encontrada' });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ message: 'Não autorizado' });
      }

      await prisma.$transaction(async (tx) => {
        // Remove a avaliação
        await tx.review.delete({
          where: { id: parseInt(id) }
        });

        // Atualiza as estatísticas do produto
        const reviews = await tx.review.findMany({
          where: {
            productId: review.productId,
            isPublic: true
          },
          select: {
            rating: true
          }
        });

        const totalReviews = reviews.length;
        const avgRating = reviews.length > 0
          ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
          : null;

        await tx.product.update({
          where: { id: review.productId },
          data: {
            avgRating,
            totalReviews
          }
        });
      });

      res.json({ message: 'Avaliação removida com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      res.status(500).json({ message: 'Erro ao deletar avaliação' });
    }
  },

  // Verificar se pode avaliar um produto
  canReview: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.userId;

      const orders = await prisma.order.findMany({
        where: {
          userId,
          status: 'DELIVERED',
          items: {
            some: {
              productId: parseInt(productId)
            }
          }
        },
        include: {
          reviews: {
            where: {
              productId: parseInt(productId)
            }
          }
        }
      });

      // Verifica se há algum pedido entregue que ainda não foi avaliado
      const canReview = orders.some(order => 
        order.reviews.length === 0
      );

      res.json({ canReview });
    } catch (error) {
      console.error('Erro ao verificar permissão de avaliação:', error);
      res.status(500).json({ message: 'Erro ao verificar permissão de avaliação' });
    }
  }
};