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
  }
};