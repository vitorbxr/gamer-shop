// backend/src/services/dashboardService.js
import { prisma } from '../lib/prisma.js';

export const dashboardService = {
  async getOverview() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
      // Buscar todas as métricas em paralelo
      const [totalOrders, todayOrders, totalProducts, lowStockProducts] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        prisma.product.count(),
        prisma.product.count({
          where: {
            stock: {
              lte: 5
            }
          }
        })
      ]);

      // Calcular valor total de vendas
      const salesData = await prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          status: 'delivered'
        }
      });

      return {
        totalOrders,
        todayOrders,
        totalProducts,
        lowStockProducts,
        totalSales: salesData._sum.totalAmount || 0
      };
    } catch (error) {
      console.error('Erro no getOverview:', error);
      throw error;
    }
  },

  async getTopProducts() {
    try {
      const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      });

      // Buscar os detalhes dos produtos
      const productsWithDetails = await Promise.all(
        topProducts.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId }
          });
          
          return {
            product: product || { name: 'Produto não encontrado' },
            quantity: item._sum.quantity || 0
          };
        })
      );

      return productsWithDetails;
    } catch (error) {
      console.error('Erro no getTopProducts:', error);
      throw error;
    }
  },

  async getSalesByPeriod() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sales = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          },
          status: 'delivered' // Considerar apenas pedidos entregues
        },
        select: {
          createdAt: true,
          totalAmount: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      // Agrupar vendas por dia
      const salesByDay = sales.reduce((acc, sale) => {
        const date = sale.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            totalAmount: 0
          };
        }
        acc[date].totalAmount += sale.totalAmount;
        return acc;
      }, {});

      // Converter para array e ordenar por data
      return Object.values(salesByDay).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
    } catch (error) {
      console.error('Erro no getSalesByPeriod:', error);
      throw error;
    }
  }
};