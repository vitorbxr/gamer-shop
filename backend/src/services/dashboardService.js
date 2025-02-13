// backend/src/services/dashboardService.js
import { prisma } from '../lib/prisma.js';

export const dashboardService = {
  async getOverview() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
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
          status: 'delivered'
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
        const date = sale.createdAt.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        if (!acc[date]) {
          acc[date] = {
            date,
            totalAmount: 0
          };
        }
        acc[date].totalAmount += sale.totalAmount;
        return acc;
      }, {});

      // Preencher dias sem vendas com zero
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
        'pending': 'Pendente',
        'processing': 'Processando',
        'shipped': 'Enviado',
        'delivered': 'Entregue',
        'cancelled': 'Cancelado'
      };

      return ordersByStatus.map(status => ({
        status: statusLabels[status.status] || status.status,
        count: status._count.id,
        color: {
          'pending': '#ECC94B',
          'processing': '#4299E1',
          'shipped': '#9F7AEA',
          'delivered': '#48BB78',
          'cancelled': '#F56565'
        }[status.status]
      }));
    } catch (error) {
      console.error('Erro ao buscar status dos pedidos:', error);
      throw error;
    }
  },

  async getSalesByCategory() {
    try {
      console.log('Iniciando query no service');
      
      // Primeiro, vamos testar apenas buscando as categorias
      const categories = await prisma.category.findMany();
      console.log('Categorias encontradas:', categories);
  
      // Se funcionar, vamos buscar os pedidos
      const orderItems = await prisma.orderItem.findMany({
        include: {
          product: true
        }
      });
      console.log('OrderItems encontrados:', orderItems);
  
      // Criar o mapa de categorias
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = {
          name: cat.name,
          value: 0,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        };
      });
  
      // Somar as quantidades
      orderItems.forEach(item => {
        const categoryId = item.product?.categoryId;
        if (categoryId && categoryMap[categoryId]) {
          categoryMap[categoryId].value += item.quantity;
        }
      });
  
      // Converter para array
      const result = Object.values(categoryMap)
        .filter(cat => cat.value > 0)
        .sort((a, b) => b.value - a.value);
  
      console.log('Resultado final:', result);
      return result;
  
    } catch (error) {
      console.error('Erro detalhado no service:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  },

  async getLowStockProducts() {
    try {
      const lowStockProducts = await prisma.product.findMany({
        where: {
          stock: {
            lte: 5  // Produtos com 5 ou menos unidades
          }
        },
        include: {
          category: true,
          brand: true
        },
        orderBy: {
          stock: 'asc'  // Ordenar do menor para o maior estoque
        }
      });
  
      return lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        category: product.category?.name || 'Sem categoria',
        brand: product.brand?.name || 'Sem marca',
        status: product.stock === 0 ? 'outOfStock' : 'lowStock',
        alert: product.stock === 0 
          ? 'Produto sem estoque!' 
          : `Estoque baixo: ${product.stock} unidades`,
        severity: product.stock === 0 ? 'error' : 'warning'
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      throw error;
    }
  },

  async getPaymentMetrics() {
    try {
      // Métricas por método de pagamento
      const paymentsByMethod = await prisma.payment.groupBy({
        by: ['method'],
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      });
  
      // Métricas de status de pagamento
      const paymentsByStatus = await prisma.payment.groupBy({
        by: ['status'],
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      });
  
      const methodLabels = {
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'pix': 'PIX',
        'boleto': 'Boleto'
      };
  
      const statusLabels = {
        'pending': 'Pendente',
        'paid': 'Pago',
        'failed': 'Falhou',
        'refunded': 'Reembolsado'
      };
  
      const statusColors = {
        'pending': '#ECC94B',  // yellow
        'paid': '#48BB78',     // green
        'failed': '#F56565',   // red
        'refunded': '#9F7AEA'  // purple
      };
  
      return {
        byMethod: paymentsByMethod.map(item => ({
          name: methodLabels[item.method] || item.method,
          count: item._count.id,
          total: item._sum.amount,
          method: item.method
        })),
        byStatus: paymentsByStatus.map(item => ({
          name: statusLabels[item.status] || item.status,
          count: item._count.id,
          total: item._sum.amount,
          status: item.status,
          color: statusColors[item.status]
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar métricas de pagamento:', error);
      throw error;
    }
  }
};