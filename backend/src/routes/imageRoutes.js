// backend/src/routes/imageRoutes.js
import express from 'express';
import { imageController, upload } from '../controllers/imageController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/upload',
  auth,
  upload.single('image'),
  imageController.uploadProductImage
);

router.delete(
  '/delete',
  auth,
  imageController.deleteProductImage
);

export default router;