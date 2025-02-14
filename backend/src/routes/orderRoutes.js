// backend/src/routes/orderRoutes.js
import express from 'express';
import { orderController } from '../controllers/orderController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, orderController.create);
router.get('/', auth, admin, orderController.getAll);
router.get('/:id', auth, orderController.getById);
router.patch('/:id/status', auth, admin, orderController.updateStatus);

export default router;