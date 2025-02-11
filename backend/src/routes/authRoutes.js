// backend/src/routes/authRoutes.js
import express from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middleware/validationMiddleware.js';
import { schemas } from '../validations/schemas.js';

const router = express.Router();

router.post('/login', 
  validate(schemas.auth.login),
  authController.login
);

router.post('/register', 
  validate(schemas.auth.register),
  authController.register
);

export default router;