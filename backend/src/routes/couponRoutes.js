// backend/src/routes/couponRoutes.js
import express from 'express';
import { couponController } from '../controllers/couponController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

// Rotas administrativas (requerem autenticação de admin)
router.post('/', auth, admin, couponController.create);
router.get('/', auth, admin, couponController.getAll);
router.get('/:id', auth, admin, couponController.getById);
router.put('/:id', auth, admin, couponController.update);

// Rotas públicas (requerem apenas autenticação)
router.post('/validate', auth, couponController.validate);
router.post('/apply', auth, couponController.apply);

export default router;