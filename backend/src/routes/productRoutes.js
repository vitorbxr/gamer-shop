// backend/src/routes/productRoutes.js
import express from 'express';
import { productController } from '../controllers/productController.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../config/multerConfig.js';

const router = express.Router();

router.get('/', productController.getAll);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/:id', productController.getById);

// Rotas que precisam de autenticação
router.use(auth);
router.post('/', upload.single('image'), productController.create);
router.post('/upload', upload.single('image'), productController.uploadImage);
router.put('/:id', upload.single('image'), productController.update);
router.delete('/:id', productController.delete);

export default router;