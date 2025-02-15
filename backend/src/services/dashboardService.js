// backend/src/services/dashboardService.js
import { prisma } from '../lib/prisma.js';

export const dashboardService = {
  async getOverview() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
      // Data do início do mês atual
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      // Data do início do mês anterior
      const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      // Pedidos pagos do mês atual
      const currentMonthSales = await prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          status: {
            in: ['PAID', 'SHIPPED', 'DELIVERED']
          },
          createdAt: {
            gte: startOfMonth
          }
        }
      });

      // Pedidos pagos do mês anterior
      const previousMonthSales = await prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          status: {
            in: ['PAID', 'SHIPPED', 'DELIVERED']
          },
          createdAt: {
            gte: startOfPreviousMonth,
            lt: startOfMonth
          }
        }
      });

      // Pedidos do dia
      const todayOrders = await prisma.order.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });

      // Pedidos aguardando envio
      const awaitingShipment = await prisma.order.count({
        where: {
          status: 'PAID'
        }
      });

      // Pedidos aguardando pagamento
      const awaitingPayment = await prisma.order.count({
        where: {
          status: 'AWAITING_PAYMENT'
        }
      });

      // Produtos e estoque
      const [totalProducts, lowStockProducts, inactiveProducts] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({
          where: {
            stock: {
              lte: 5
            },
            isActive: true
          }
        }),
        prisma.product.count({
          where: {
            isActive: false
          }
        })
      ]);

      // Calcula variação percentual em relação ao mês anterior
      const currentTotal = currentMonthSales._sum.totalAmount || 0;
      const previousTotal = previousMonthSales._sum.totalAmount || 0;
      const salesGrowth = previousTotal > 0 
        ? ((currentTotal - previousTotal) / previousTotal) * 100 
        : 0;

      return {
        sales: {
          currentMonth: currentTotal,
          previousMonth: previousTotal,
          growth: salesGrowth
        },
        orders: {
          today: todayOrders,
          awaitingShipment,
          awaitingPayment
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
          inactive: inactiveProducts
        }
      };
    } catch (error) {
      console.error('Erro no getOverview:', error);
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
          status: {
            in: ['PAID', 'SHIPPED', 'DELIVERED']
          }
        },
        select: {
          createdAt: true,
          totalAmount: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      const salesByDay = sales.reduce((acc, sale) => {
        const date = sale.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            totalAmount: 0
          };
        }
        acc[date].totalAmount += Number(sale.totalAmount);
        return acc;
      }, {});

      const allDays = [];
      const currentDate = new Date(thirtyDaysAgo);
      const today = new Date();

      while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (!salesByDay[dateStr]) {
          salesByDay[dateStr] = {
            date: dateStr,
            totalAmount: 0
          };
        }
        allDays.push(salesByDay[dateStr]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return allDays.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Erro no getSalesByPeriod:', error);
      throw error;
    }
  },

  async getOrderStatus() {
    try {
      const ordersByStatus = await prisma.order.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });

      const statusLabels = {
        'AWAITING_PAYMENT': 'Aguardando Pagamento',
        'PAID': 'Pago',
        'SHIPPED': 'Enviado',
        'DELIVERED': 'Entregue',
        'CANCELLED': 'Cancelado'
      };

      const statusColors = {
        'AWAITING_PAYMENT': '#ECC94B', // Amarelo
        'PAID': '#3182CE',            // Azul
        'SHIPPED': '#805AD5',         // Roxo
        'DELIVERED': '#38A169',       // Verde
        'CANCELLED': '#E53E3E'        // Vermelho
      };

      return ordersByStatus.map(item => ({
        status: statusLabels[item.status] || item.status,
        count: item._count.id,
        color: statusColors[item.status]
      }));
    } catch (error) {
      console.error('Erro ao buscar status dos pedidos:', error);
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
        where: {
          order: {
            status: {
              in: ['PAID', 'SHIPPED', 'DELIVERED']
            }
          }
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      });

      const productsWithDetails = await Promise.all(
        topProducts.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: {
              name: true,
              price: true
            }
          });
          
          return {
            product,
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

  async getSalesByCategory() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: {
            include: {
              orderItems: {
                where: {
                  order: {
                    status: {
                      in: ['PAID', 'SHIPPED', 'DELIVERED']
                    }
                  }
                }
              }
            }
          }
        }
      });

      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
      
      return categories.map((category, index) => {
        const totalSold = category.products.reduce((total, product) => {
          return total + product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);

        return {
          name: category.name,
          value: totalSold,
          color: colors[index % colors.length]
        };
      }).filter(cat => cat.value > 0);
    } catch (error) {
      console.error('Erro no getSalesByCategory:', error);
      throw error;
    }
  },

  async getPaymentMetrics() {
    try {
      const [paymentsByMethod, paymentsByStatus] = await Promise.all([
        prisma.payment.groupBy({
          by: ['method'],
          _count: {
            id: true
          },
          _sum: {
            amount: true
          }
        }),
        prisma.payment.groupBy({
          by: ['status'],
          _count: {
            id: true
          },
          _sum: {
            amount: true
          }
        })
      ]);

      const methodLabels = {
        'CREDIT_CARD': 'Cartão de Crédito',
        'DEBIT_CARD': 'Cartão de Débito',
        'MBWAY': 'MB WAY',
        'MULTIBANCO': 'Multibanco'
      };

      const statusColors = {
        'PENDING': '#ECC94B',
        'PROCESSING': '#3182CE',
        'COMPLETED': '#38A169',
        'FAILED': '#E53E3E',
        'REFUNDED': '#805AD5'
      };

      return {
        byMethod: paymentsByMethod.map(item => ({
          name: methodLabels[item.method] || item.method,
          count: item._count.id,
          total: item._sum.amount || 0
        })),
        byStatus: paymentsByStatus.map(item => ({
          name: item.status,
          count: item._count.id,
          total: item._sum.amount || 0,
          color: statusColors[item.status]
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar métricas de pagamento:', error);
      throw error;
    }
  }
};