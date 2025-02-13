// backend/src/controllers/dashboardController.js
import { dashboardService } from '../services/dashboardService.js';

export const dashboardController = {
  getOverview: async (req, res) => {
    try {
      const overview = await dashboardService.getOverview();
      res.json(overview);
    } catch (error) {
      console.error('Erro no getOverview:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getTopProducts: async (req, res) => {
    try {
      const topProducts = await dashboardService.getTopProducts();
      res.json(topProducts);
    } catch (error) {
      console.error('Erro no getTopProducts:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getSalesByPeriod: async (req, res) => {
    try {
      const sales = await dashboardService.getSalesByPeriod();
      res.json(sales);
    } catch (error) {
      console.error('Erro no getSalesByPeriod:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getOrderStatus(req, res) {
    try {
      const orderStatus = await dashboardService.getOrderStatus();
      res.json(orderStatus);
    } catch (error) {
      console.error('Erro ao buscar status dos pedidos:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getSalesByCategory(req, res) {
    try {
      console.log('Iniciando busca de vendas por categoria');
      const categoryData = await dashboardService.getSalesByCategory();
      console.log('Dados obtidos:', categoryData);
      res.json(categoryData);
    } catch (error) {
      console.error('Erro completo:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ 
        error: error.message,
        details: error.stack 
      });
    }
  },

  async getLowStockProducts(req, res) {
    try {
      const products = await dashboardService.getLowStockProducts();
      res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getPaymentMetrics(req, res) {
    try {
      const metrics = await dashboardService.getPaymentMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Erro ao buscar métricas de pagamento:', error);
      res.status(500).json({ error: error.message });
    }
  }
};