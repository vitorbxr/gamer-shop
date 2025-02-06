// backend/src/routes/productRoutes.js
import express from 'express';
import { productController } from '../controllers/productController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', productController.getAll);
router.post('/', auth, productController.create);
router.put('/:id', auth, productController.update);
router.delete('/:id', auth, productController.delete);

export default router;