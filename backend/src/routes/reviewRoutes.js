// backend/src/routes/reviewRoutes.js
import express from 'express';
import { reviewController } from '../controllers/reviewController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/product/:productId', reviewController.getProductReviews);

// Rotas que necessitam autenticação
router.post('/', auth, reviewController.create);
router.get('/user', auth, reviewController.getUserReviews);
router.put('/:id', auth, reviewController.update);
router.delete('/:id', auth, reviewController.delete);

// Rota para verificar se pode avaliar
router.get('/can-review/:productId', auth, reviewController.canReview);

export default router;