// backend/src/routes/orderRoutes.js
import express from 'express';
import { orderController } from '../controllers/orderController.js';
import { auth, admin } from '../middleware/auth.js';
import trackingService from '../services/trackingService.js';

const router = express.Router();

// Rota de teste para listar couriers
router.get('/test/couriers', auth, admin, async (req, res) => {
  try {
    const couriers = await trackingService.listCouriers();
    res.json(couriers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para todos os usuários autenticados
router.post('/', auth, orderController.create);
router.get('/user', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getById);
router.get('/:id/tracking', auth, orderController.getTrackingInfo);

// Rotas que requerem privilégios de admin
router.get('/', auth, admin, orderController.getAll);
router.patch('/:id/status', auth, admin, orderController.updateStatus);
router.post('/:id/tracking', auth, admin, orderController.updateTrackingNumber);

export default router;