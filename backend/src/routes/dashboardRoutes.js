// backend/src/routes/dashboardRoutes.js
import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', auth, dashboardController.getOverview);
router.get('/top-products', auth, dashboardController.getTopProducts);
router.get('/sales-by-period', auth, dashboardController.getSalesByPeriod);

export default router;