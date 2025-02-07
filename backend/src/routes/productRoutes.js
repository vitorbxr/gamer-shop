// backend/src/routes/productRoutes.js
import express from 'express';
import { productController } from '../controllers/productController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validationMiddleware.js';
import { schemas } from '../validations/schemas.js';
import { upload } from '../config/multerConfig.js';

const router = express.Router();

// Rotas públicas
router.get('/', productController.getAll);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/:id', productController.getById);

// Rotas protegidas
router.use(auth);

router.post('/', 
  upload.single('image'),
  validate(schemas.product.create),
  productController.create
);

router.put('/:id', 
  upload.single('image'),
  validate(schemas.product.update),
  productController.update
);

router.delete('/:id', productController.delete);

router.post('/upload', 
  upload.single('image'),
  productController.uploadImage
);

export default router;