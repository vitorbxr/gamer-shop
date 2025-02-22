// backend/src/routes/orderRoutes.js
import express from 'express';
import { orderController } from '../controllers/orderController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

// Rotas para todos os usuários autenticados
router.post('/', auth, orderController.create);
router.get('/user', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getById);

// Rotas que requerem privilégios de admin
router.get('/', auth, admin, orderController.getAll);
router.patch('/:id/status', auth, admin, orderController.updateStatus);
router.post('/:id/tracking', auth, admin, orderController.updateTrackingNumber); // Adicionada esta rota
router.patch('/:id', auth, admin, orderController.updateOrder);
router.delete('/:id', auth, admin, orderController.deleteOrder);

export default router;